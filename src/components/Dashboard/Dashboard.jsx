// src/components/Dashboard/Dashboard.jsx

import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as incidentService from '../../services/incidentService';
import * as threatService from '../../services/threatService';
import * as investigationService from '../../services/investigationService';

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const SEVERITY_CLASS = { Low: 'low', Medium: 'medium', High: 'high', Critical: 'critical' };

// category -> icon + color family, matches the same families used on the Incident list
const CATEGORY_STYLE = {
  Phishing: { icon: 'mail', family: 'red' },
  Malware: { icon: 'virus', family: 'amber' },
  'Unauthorized Access': { icon: 'fingerprint', family: 'green' },
  'Data Breach': { icon: 'shield-x', family: 'red' },
  DDoS: { icon: 'server-off', family: 'amber' },
  'Suspicious Activity': { icon: 'eye-exclamation', family: 'green' },
  Other: { icon: 'alert-triangle', family: 'gray' },
};

// turns a timestamp into "5m ago", "3h ago", "2d ago", so the feed reads naturally
const timeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const initials = (name) => (name || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [incidents, setIncidents] = useState([]);
  const [threats, setThreats] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      const [incidentResult, threatResult, investigationResult] = await Promise.allSettled([
        incidentService.index(),
        threatService.index(),
        investigationService.index(),
      ]);

      const failedResources = [];

      if (incidentResult.status === 'fulfilled') {
        setIncidents(incidentResult.value);
      } else {
        console.log('Incidents failed to load:', incidentResult.reason);
        failedResources.push('incidents');
      }

      if (threatResult.status === 'fulfilled') {
        setThreats(threatResult.value);
      } else {
        console.log('Threats failed to load:', threatResult.reason);
        failedResources.push('threats');
      }

      if (investigationResult.status === 'fulfilled') {
        setInvestigations(investigationResult.value);
      } else {
        console.log('Investigations failed to load:', investigationResult.reason);
        failedResources.push('investigations');
      }

      if (failedResources.length > 0) {
        setMessage(`Couldn't load: ${failedResources.join(', ')}`);
      }
    };
    if (user) fetchAll();
  }, [user]);

  const criticalIncidents = incidents.filter((i) => i.severity === 'Critical').length;
  const activeThreats = threats.filter((t) => t.status === 'Active').length;
  const inProgressInvestigations = investigations.filter((i) => i.status === 'In Progress').length;

  // severity breakdown, across all incidents
  const severityCounts = SEVERITIES.map((sev) => ({
    severity: sev,
    count: incidents.filter((i) => i.severity === sev).length,
  }));
  const maxSeverityCount = Math.max(1, ...severityCounts.map((s) => s.count));

  // category breakdown, across all incidents
  const categoryCounts = Object.keys(CATEGORY_STYLE)
    .map((cat) => ({ category: cat, count: incidents.filter((i) => i.category === cat).length, ...CATEGORY_STYLE[cat] }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
  const maxCategoryCount = Math.max(1, ...categoryCounts.map((c) => c.count));

  // combine all three resources into one feed, sorted by most recently created
  const feed = [
    ...incidents.map((i) => ({
      id: i._id,
      type: 'incident',
      typeLabel: 'Incident',
      title: i.title,
      date: i.createdAt,
      icon: (CATEGORY_STYLE[i.category] || CATEGORY_STYLE.Other).icon,
      iconFamily: (CATEGORY_STYLE[i.category] || CATEGORY_STYLE.Other).family,
    })),
    ...threats.map((t) => ({
      id: t._id,
      type: 'threat',
      typeLabel: 'Threat',
      title: t.name,
      date: t.createdAt,
      icon: 'bug',
      iconFamily: 'amber',
    })),
    ...investigations.map((inv) => ({
      id: inv._id,
      type: 'investigation',
      typeLabel: 'Investigation',
      title: inv.title,
      date: inv.createdAt,
      icon: 'search',
      iconFamily: 'green',
    })),
  ]
    .filter((item) => item.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  // tally who's assigned to the most incidents + investigations, for a quick team workload view
  const workloadMap = {};
  [...incidents, ...investigations].forEach((item) => {
    const assignee = item.assignedTo;
    if (!assignee) return;
    const key = assignee._id || assignee;
    const name = assignee.name || assignee.username || 'Unknown';
    if (!workloadMap[key]) workloadMap[key] = { name, count: 0 };
    workloadMap[key].count += 1;
  });
  const workload = Object.values(workloadMap).sort((a, b) => b.count - a.count).slice(0, 5);
  const maxWorkload = Math.max(1, ...workload.map((w) => w.count));

  return (
    <main>
      <div className="dashboard-header">
        <h1>Welcome, {user.username}</h1>
        <p>Here's what's happening across your team</p>
      </div>

      {message && <p className="error-message">{message}</p>}

      <div className="stat-grid">
        <div className="stat-card stat-card-accent-teal">
          <div className="stat-card-top">
            <span className="stat-card-label">Incidents</span>
            <i className="ti ti-alert-triangle stat-icon-teal" aria-hidden="true"></i>
          </div>
          <p className="stat-card-count">{incidents.length}</p>
          {criticalIncidents > 0 && (
            <p className="stat-card-sub stat-card-sub-critical">{criticalIncidents} critical</p>
          )}
        </div>

        <div className="stat-card stat-card-accent-amber">
          <div className="stat-card-top">
            <span className="stat-card-label">Threats</span>
            <i className="ti ti-bug stat-icon-amber" aria-hidden="true"></i>
          </div>
          <p className="stat-card-count">{threats.length}</p>
          {activeThreats > 0 && (
            <p className="stat-card-sub stat-card-sub-medium">{activeThreats} active</p>
          )}
        </div>

        <div className="stat-card stat-card-accent-info">
          <div className="stat-card-top">
            <span className="stat-card-label">Investigations</span>
            <i className="ti ti-search stat-icon-info" aria-hidden="true"></i>
          </div>
          <p className="stat-card-count">{investigations.length}</p>
          {inProgressInvestigations > 0 && (
            <p className="stat-card-sub stat-card-sub-info">{inProgressInvestigations} in progress</p>
          )}
        </div>
      </div>

      {incidents.length > 0 && (
        <div className="dashboard-charts">
          <div className="severity-chart">
            <p className="chart-title">Severity breakdown</p>
            {severityCounts.map(({ severity, count }) => {
              const sevClass = SEVERITY_CLASS[severity];
              return (
                <div className="severity-chart-row" key={severity}>
                  <span className={`severity-chart-label severity-chart-label-${sevClass}`}>{severity}</span>
                  <div className="severity-chart-track">
                    <div
                      className={`severity-chart-fill severity-chart-fill-${sevClass}`}
                      style={{ '--fill-percent': `${(count / maxSeverityCount) * 100}%` }}
                    />
                  </div>
                  <span className="severity-chart-count">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="category-chart">
            <p className="chart-title">By category</p>
            {categoryCounts.map(({ category, count, family }) => (
              <div className="category-chart-row" key={category}>
                <span className="category-chart-label">{category}</span>
                <div className="category-chart-track">
                  <div
                    className={`category-chart-fill category-chart-fill-${family}`}
                    style={{ '--fill-percent': `${(count / maxCategoryCount) * 100}%` }}
                  />
                </div>
                <span className="category-chart-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {feed.length > 0 && (
        <>
          <p className="eyebrow">Recent activity</p>
          <div className="activity-feed">
            {feed.map((item) => (
              <div className="activity-item" key={`${item.type}-${item.id}`}>
                <div className={`activity-icon activity-icon-${item.iconFamily}`}>
                  <i className={`ti ti-${item.icon}`} aria-hidden="true"></i>
                </div>
                <div className="activity-body">
                  <p className="activity-title">{item.title}</p>
                  <p className="activity-meta">{timeAgo(item.date)}</p>
                </div>
                <span className={`activity-type-badge activity-type-${item.type}`}>{item.typeLabel}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {workload.length > 0 && (
        <>
          <p className="eyebrow">Team workload</p>
          <div className="team-list">
            {workload.map((person) => (
              <div className="team-row" key={person.name}>
                <div className="team-avatar">{initials(person.name)}</div>
                <span className="team-name">{person.name}</span>
                <div className="team-track">
                  <div className="team-fill" style={{ '--fill-percent': `${(person.count / maxWorkload) * 100}%` }} />
                </div>
                <span className="team-count">{person.count} assigned</span>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Dashboard;