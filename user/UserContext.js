import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [sender, setSender] = useState(null);
  const [userUID, setUserUID] = useState(null); // Initialize with null

  return (
    <UserContext.Provider value={{ sender, setSender,userUID, setUserUID  }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
