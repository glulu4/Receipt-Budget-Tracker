import React, { createContext, useState, useContext } from 'react';

const TabBarVisibilityContext = createContext();

export const useTabBarVisibility = () => useContext(TabBarVisibilityContext);

export const TabBarVisibilityProvider = ({ children }) => {
    const [isTabBarVisible, setIsTabBarVisible] = useState(true);

    return (
        <TabBarVisibilityContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
            {children}
        </TabBarVisibilityContext.Provider>
    );
};
