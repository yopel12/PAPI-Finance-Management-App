import React, { createContext, useState } from 'react';
import avatar from '../assets/avatar.png';


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    phone: '',
    address: '',
    place: '',
    dob: '',
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
