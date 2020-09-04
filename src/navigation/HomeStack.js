import * as React from 'react';
import { path } from 'ramda';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from 'screens/HomeScreen';
import SearchBlockerScreen from 'screens/SearchBlockerScreen';
import Colors from 'constants/Colors';

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      cardStyle: {
        backgroundColor: Colors.screenBackground,
      },
    }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="SearchBlocker" component={SearchBlockerScreen} />
  </Stack.Navigator>
);

export default HomeStack;
