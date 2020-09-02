import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from 'screens/HomeScreen';
import SearchBlockerScreen from 'screens/SearchBlockerScreen';

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="SearchBlocker" component={SearchBlockerScreen} />
  </Stack.Navigator>
);

export default HomeStack;
