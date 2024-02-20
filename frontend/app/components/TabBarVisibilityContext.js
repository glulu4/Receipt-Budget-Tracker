import React, { createContext, useState, useContext } from 'react';

const TabBarVisibilityContext = createContext();

export const useGlobalContext = () => useContext(TabBarVisibilityContext);

export const TabBarVisibilityProvider = ({ children }) => {
    const [isTabBarVisible, setIsTabBarVisible] = useState(true);
    const [shouldFetchTotal, setShouldFetchTotal] = useState(false);


    const [isSignIn, setIsSignIn] = useState(false);

    const [currentUser, setCurrentUser] = useState({})

    return (
        <TabBarVisibilityContext.Provider value={{
            isTabBarVisible,
            setIsTabBarVisible,
            shouldFetchTotal,
            setShouldFetchTotal,
            isSignIn,
            setIsSignIn,
            currentUser, 
            setCurrentUser

        }}>
            {children}
        </TabBarVisibilityContext.Provider>
    );
};
