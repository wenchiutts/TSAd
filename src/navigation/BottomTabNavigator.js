import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from 'navigation/HomeStack';
import SettingsScreen from 'screens/SettingsScreen';
import InsightScreen from 'screens/InsightScreen';

const Tab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default () => (
  <Tab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Insight" component={InsightScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);
