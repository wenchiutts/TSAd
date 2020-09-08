import * as React from 'react';
import { path } from 'ramda';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from 'navigation/HomeStack';
import SettingsScreen from 'screens/SettingsScreen';
import InsightScreen from 'screens/InsightScreen';
import TabBarIcon from 'components/TabBarIcon';
import styled from 'styled-components';

const Tab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // const headerTitle = getHeaderTitle(route);
  navigation.setOptions({
    headerTitle: getHeaderTitle(route),
    // header: () => (
    //   <>
    //     <BlurView intensity={10}>
    //       <View style={{ height: 60 }}>
    //         <Text style={{ color: '#fff' }}>{headerTitle}</Text>
    //       </View>
    //     </BlurView>
    //   </>
    // ),
  });

  return (
    <Tab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{
        showLabel: false,
        style: {
          borderTopWidth: 0,
          height: 90,
          backgroundColor: 'transparent',
          position: 'absolute',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => {
          const routeName =
            route.state?.routes[route.state.index]?.name || route.state?.routes[0]?.name || 'Home';
          if (routeName === 'Home') {
            return {
              tabBarVisible: true,
              tabBarIcon: props => (
                <TabBarIcon
                  {...props}
                  activeImg={require('assets/icons/tabbar_home_S.png')}
                  inActiveImg={require('assets/icons/tabbar_home_N.png')}
                />
              ),
            };
          }
          return {
            tabBarVisible: false,
            tabBarIcon: props => (
              <TabBarIcon
                {...props}
                activeImg={require('assets/icons/tabbar_home_S.png')}
                inActiveImg={require('assets/icons/tabbar_home_N.png')}
              />
            ),
          };
        }}
      />
      <Tab.Screen
        name="Insight"
        component={InsightScreen}
        options={{
          cardStyle: { backgroundColor: '#0C0A2E' },
          tabBarIcon: props => (
            <TabBarIcon
              {...props}
              activeImg={require('assets/icons/tabbar_insight_S.png')}
              inActiveImg={require('assets/icons/tabbar_insight_N.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: props => (
            <TabBarIcon
              {...props}
              activeImg={require('assets/icons/tabbar_more_S.png')}
              inActiveImg={require('assets/icons/tabbar_more_N.png')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ||
    route.state?.routes[0]?.name ||
    INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Ins Reports';
    case 'Insight':
      return 'Insight';
    case 'Settings':
      return 'Settings';
  }
}
