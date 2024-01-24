// import React, { createContext, useState, useContext } from 'react';

// const TabBarVisibilityContext = createContext();

// export const useTabBarVisibility = () => useContext(TabBarVisibilityContext);

// export const TabBarVisibilityProvider = ({ children }) => {
//     const [isTabBarVisible, setIsTabBarVisible] = useState(true);

//     return (
//         <TabBarVisibilityContext.Provider value={{ isTabBarVisible, setIsTabBarVisible }}>
//             {children}
//         </TabBarVisibilityContext.Provider>
//     );
// };

import React, { createContext, useState, useContext } from 'react';

const TabBarVisibilityContext = createContext();

export const useGlobalContext = () => useContext(TabBarVisibilityContext);

export const TabBarVisibilityProvider = ({ children }) => {
    const [isTabBarVisible, setIsTabBarVisible] = useState(true);
    const [shouldFetchTotal, setShouldFetchTotal] = useState(false);

    return (
        <TabBarVisibilityContext.Provider value={{
            isTabBarVisible,
            setIsTabBarVisible,
            shouldFetchTotal,
            setShouldFetchTotal
        }}>
            {children}
        </TabBarVisibilityContext.Provider>
    );
};
