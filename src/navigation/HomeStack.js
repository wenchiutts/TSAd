import * as React from 'react';
import { path } from 'ramda';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from 'screens/HomeScreen';
import SearchBlockerScreen from 'screens/SearchBlockerScreen';
import NewFollowersScreen from 'screens/NewFollowersScreen';
import UnfollowersScreen from 'screens/UnfollowersScreen';
import NotFollowingMeBackScreen from 'screens/NotFollowingMeBackScreen';
import ImNotFollowingBackScreen from 'screens/ImNotFollowingBackScreen';
import MutualFollowingScreen from 'screens/MutualFollowingScreen';
import BestFollowersScreen from 'screens/BestFollowersScreen';
import GhostFollowersScreen from 'screens/GhostFollowersScreen';
import ViewMyProfileScreen from 'screens/ViewMyProfileScreen';

import BackButton from 'components/header/BackButton';

import Colors from 'constants/Colors';

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Home';

const HomeStack = ({ navigation, route }) => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      cardStyle: {
        backgroundColor: Colors.screenBackground,
      },
      headerTitle: getHeaderTitle(route),
      headerTitleAlign: 'center',
      headerHideShadow: true,
      headerStyle: {
        backgroundColor: Colors.screenBackground,
        borderBottomWidth: 0,
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        },
      },
      headerTintColor: Colors.primary.lightBlue,
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
      },
      headerLeft: () => <BackButton />,
    }}>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerLeft: null }} />
    <Stack.Screen name="SearchBlocker" component={SearchBlockerScreen} />
    <Stack.Screen name="NewFollowers" component={NewFollowersScreen} />
    <Stack.Screen name="Unfollowers" component={UnfollowersScreen} />
    <Stack.Screen name="NotFollowingMeBack" component={NotFollowingMeBackScreen} />
    <Stack.Screen name="ImNotFollowingBack" component={ImNotFollowingBackScreen} />
    <Stack.Screen name="MutualFollowing" component={MutualFollowingScreen} />
    <Stack.Screen name="BestFollowers" component={BestFollowersScreen} />
    <Stack.Screen name="GhostFollowers" component={GhostFollowersScreen} />
    <Stack.Screen name="ViewMyProfile" component={ViewMyProfileScreen} />
  </Stack.Navigator>
);

export default HomeStack;

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ||
    route.state?.routes[0]?.name ||
    INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Ins Reports';
    case 'SearchBlocker':
      return 'Search Blockers';
    case 'NewFollowers':
      return 'New followers';
    case 'Unfollowers':
      return 'Unfollow';
    case 'NotFollowingMeBack':
      return 'Not Following Me Back';
    case 'ImNotFollowingBack':
      return `I'm Not Following Back`;
    case 'MutualFollowing':
      return 'Mutual Following';
    case 'BestFollowers':
      return 'Best Followers';
    case 'GhostFollowers':
      return 'Ghost Followers';
    case 'ViewMyProfile':
      return 'Who Viewed My Profile';
    default:
      return 'Ins Reports';
  }
}
