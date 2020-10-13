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
import i18n from 'i18n';

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
      return i18n.t('general_app_title');
    case 'ViewMyProfile':
      return i18n.t('home_view_my_profile');
    case 'NewFollowers':
      return i18n.t('home_new_followers');
    case 'Unfollowers':
      return i18n.t('home_unfollowers');
    case 'SearchBlocker':
      return i18n.t('home_blocking_me');
    case 'NotFollowingMeBack':
      return i18n.t('home_not_following_back');
    case 'ImNotFollowingBack':
      return i18n.t('home_im_not_following_back');
    case 'MutualFollowing':
      return i18n.t('home_mutual_following');
    case 'BestFollowers':
      return i18n.t('home_best_followers');
    case 'GhostFollowers':
      return i18n.t('home_ghost_followers');
    default:
      return i18n.t('general_app_title');
  }
}
