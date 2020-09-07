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
      headerTitle: 'Ins Reports',
      headerTitleAlign: 'center',
      headerHideShadow: true,
      headerStyle: {
        borderBottomWidth: 0,
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        },
      },
      headerTransparent: true,
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
      },
    }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen
      name="SearchBlocker"
      component={SearchBlockerScreen}
      options={{ headerTitle: 'Search Blockers' }}
    />
  </Stack.Navigator>
);

export default HomeStack;
