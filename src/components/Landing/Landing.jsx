// src/components/Landing/Landing.jsx

import { Link } from 'react-router';
import Logo from '../Logo/Logo';

const FEATURES = [
  {
    icon: 'alert-triangle',
    family: 'red',
    title: 'Track incidents',
    description: 'Log, categorize, and follow every security incident from report to resolution.',
  },
  {
    icon: 'search',
    family: 'green',
    title: 'Run investigations',
    description: 'Assign analysts, record findings, and keep every case moving forward.',
  },
  {
    icon: 'shield-x',
    family: 'amber',
    title: 'Monitor threats',
    description: 'Catalog indicators of compromise and link them back to the incidents that raised them.',
  },
  {
    icon: 'chart-bar',
    family: 'gray',
    title: 'See the big picture',
    description: 'A live dashboard of severity trends, category breakdowns, and team workload.',
  },
];

const STEPS = [
  {
    title: 'Report',
    description: 'Log an incident the moment something looks off — severity, category, and details in one form.',
  },
  {
    title: 'Investigate',
    description: 'Assign an analyst, record findings, and link related threats as the picture comes together.',
  },
  {
    title: 'Resolve',
    description: 'Close the loop with a full audit trail — who touched what, and when.',
  },
];

const Landing = () => {
  return (
    <main>
      <div className="landing-hero">
        <svg className="landing-hero-shapes" width="300" height="220" viewBox="0 0 300 220">
          <polygon points="180,10 235,42 235,102 180,134 125,102 125,42" fill="none" stroke="#1c3a34" strokeWidth="2" />
          <polygon points="230,90 265,110 265,150 230,170 195,150 195,110" fill="none" stroke="#12352f" strokeWidth="2" />
          <circle cx="70" cy="150" r="40" fill="none" stroke="#12352f" strokeWidth="2" />
          <circle cx="40" cy="60" r="3" fill="#1c3a34" />
          <circle cx="270" cy="60" r="3" fill="#1c3a34" />
        </svg>

        <div className="landing-logo">
          <Logo size={40} />
        </div>
        <p className="eyebrow landing-eyebrow">CyberTrack</p>
        <h1>Security incident tracking, built for the whole team.</h1>
        <p className="landing-subtitle">
          Log incidents, coordinate investigations, and monitor threats in one shared workspace —
          built for analysts who need clarity, not chaos.
        </p>
        <div className="landing-actions">
          <Link to="/sign-up" className="btn btn-light">Sign up — it's free</Link>
          <Link to="/sign-in" className="btn btn-secondary landing-btn-secondary">Sign in</Link>
        </div>
      </div>

      <p className="eyebrow landing-section-eyebrow">What you get</p>
      <div className="landing-features">
        {FEATURES.map((feature) => (
          <div className="landing-feature-card" key={feature.title}>
            <div className={`incident-row-icon icon-chip-${feature.family} landing-feature-icon`}>
              <i className={`ti ti-${feature.icon}`} aria-hidden="true"></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <p className="eyebrow landing-section-eyebrow">How it works</p>
      <div className="landing-steps">
        {STEPS.map((step, i) => (
          <div className="landing-step" key={step.title}>
            <div className="landing-step-number">{i + 1}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>

      <div className="landing-cta">
        <div>
          <h2>Ready to get your team organized?</h2>
          <p>Create an account and start tracking incidents in minutes.</p>
        </div>
        <Link to="/sign-up" className="btn btn-primary">Get started</Link>
      </div>

      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <Logo size={16} />
          CyberTrack
        </div>
        <p>Built for security teams who need to move fast.</p>
      </footer>
    </main>
  );
};

export default Landing;
