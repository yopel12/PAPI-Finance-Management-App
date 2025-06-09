import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    phone: '',
    address: '',
    place: '',
    dob: null, // ✅ should be a Date object, not an empty string
    gender: '',
    image: require('../assets/avatar.png'), // Default image
  });

  const updateUser = (updates) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updates,
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
