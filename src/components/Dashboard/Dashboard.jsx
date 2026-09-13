// src/components/Dashboard/Dashboard.jsx

import { useEffect, useState, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.index();
        setUsers(fetchedUsers);
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>
        This is the dashboard page where you can see a list of all the users.
      </p>
      <ul>
        {users.map((otherUser) => (
          <li key={otherUser._id}>{otherUser.username}</li>
        ))}
      </ul>
    </main>
  );
};

export default Dashboard;