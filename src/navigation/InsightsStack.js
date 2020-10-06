import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import InsightsScreen from 'screens/InsightsScreen';
import StoryHistoryScreen from 'modules/insights/components/StoryHistoryScreen';
import TopViewerScreen from 'modules/insights/components/TopViewerScreen';
import LeastViewerScreen from 'modules/insights/components/LeastViewerScreen';
import MostPopularPostsScreen from 'screens/insights/MostPopularPostsScreen';
import MostLikedPostsScreens from 'screens/insights/MostLikedPostsScreens';
import MostCommentedPostsScreen from 'screens/insights/MostCommentedPostsScreen';

import BackButton from 'components/header/BackButton';
import Colors from 'constants/Colors';
import MostViewedStoriesScreen from 'modules/insights/components/MostViewedStoriesScreen';
import LeastViewedStoriesScreen from 'modules/insights/components/LeastViewedStoriesScreen';
import StoryDetailInsightScreen from 'modules/insights/components/StoryDetailInsightScreen';

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Insight';

const InsightsStack = ({ navigation, route }) => (
  <Stack.Navigator
    initialRouteName="Insight"
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
    <Stack.Screen name="Insight" component={InsightsScreen} options={{ headerLeft: null }} />
    <Stack.Screen name="StoryHistory" component={StoryHistoryScreen} />
    <Stack.Screen name="TopViewers" component={TopViewerScreen} />
    <Stack.Screen name="LeastViewers" component={LeastViewerScreen} />
    <Stack.Screen name="MostViewedStories" component={MostViewedStoriesScreen} />
    <Stack.Screen name="LeastViewedStories" component={LeastViewedStoriesScreen} />
    <Stack.Screen name="MostPopularPosts" component={MostPopularPostsScreen} />
    <Stack.Screen name="MostLikedPosts" component={MostLikedPostsScreens} />
    <Stack.Screen name="MostCommentedPosts" component={MostCommentedPostsScreen} />
    <Stack.Screen name="StoryDetailInsight" component={StoryDetailInsightScreen} />
  </Stack.Navigator>
);

export default InsightsStack;

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ||
    route.state?.routes[0]?.name ||
    INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Insight':
      return 'Insights';
    case 'MostPopularPosts':
      return 'Most Popular Posts';
    case 'MostLikedPosts':
      return 'Most Liked Posts';
    case 'MostCommentedPosts':
      return 'Most Commented Posts';
    case 'StoryHistory':
      return 'History';
    case 'TopViewers':
      return 'Top Viewers';
    case 'LeastViewers':
      return 'Least Viewers';
    default:
      return 'Insights';
  }
}
