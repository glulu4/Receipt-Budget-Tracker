// AppWrapper.js
import React from 'react';
import App from './App'; // Import your App component
import { TabBarVisibilityProvider } from './components/TabBarVisibilityContext';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

const AppWrapper = () => {
    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <TabBarVisibilityProvider>
                <App />
            </TabBarVisibilityProvider>
        </ApplicationProvider>

    );
};

export default AppWrapper;
