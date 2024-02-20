// AppWrapper.js
import React from 'react';
import App from './App'; // Import your App component
import { TabBarVisibilityProvider } from './components/TabBarVisibilityContext';

const AppWrapper = () => {
    return (
        <TabBarVisibilityProvider>
            <App />
        </TabBarVisibilityProvider>
    );
};

export default AppWrapper;
