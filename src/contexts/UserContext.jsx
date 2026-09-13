// src/contexts/UserContext.jsx

import { createContext, useState } from 'react';

const UserContext = createContext();

// checks localStorage for an existing token and pulls the user data back out of it
const getUserFromToken = () => {
  const tokenInStorage = localStorage.getItem('token');

  if (!tokenInStorage) return null;

  return JSON.parse(atob(tokenInStorage.split('.')[1]));
};

function UserProvider({ children }) {
  const [user, setUser] = useState(getUserFromToken());

  const value = { user, setUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.UserContext = UserContext;

export default UserProvider;