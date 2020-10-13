import * as React from 'react';
import { path } from 'ramda';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from 'navigation/HomeStack';
import SettingsScreen from 'screens/SettingsScreen';
import InsightsStack from 'navigation/InsightsStack';

import TabBarIcon from 'components/TabBarIcon';
import styled from 'styled-components';
import Colors from 'constants/Colors';
import i18n from 'i18n';

const Tab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
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
          height: 80,
          backgroundColor: Colors.screenBackground,
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
        component={InsightsStack}
        options={({ route }) => {
          const routeName =
            route.state?.routes[route.state.index]?.name ||
            route.state?.routes[0]?.name ||
            'Insight';
          if (routeName === 'Insight') {
            return {
              tabBarVisible: true,
              tabBarIcon: props => (
                <TabBarIcon
                  {...props}
                  activeImg={require('assets/icons/tabbar_insight_S.png')}
                  inActiveImg={require('assets/icons/tabbar_insight_N.png')}
                />
              ),
            };
          } else {
            return {
              tabBarVisible: false,
              tabBarIcon: props => (
                <TabBarIcon
                  {...props}
                  activeImg={require('assets/icons/tabbar_insight_S.png')}
                  inActiveImg={require('assets/icons/tabbar_insight_N.png')}
                />
              ),
            };
          }
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
      return i18n.t('general_app_title');
    case 'Insight':
      return i18n.t('insight_title');
    case 'Settings':
      return i18n.t('settings_title');
  }
}
