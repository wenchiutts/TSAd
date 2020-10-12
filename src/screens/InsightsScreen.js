// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Text, View, ScrollView, Dimensions, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { path, pathOr } from 'ramda';

import IconListItem from 'components/IconListItem';
import RecentStorySlider from 'modules/insights/components/RecentStorySlider';
import useFetchArchiveStory from 'modules/insights/hooks/useFetchArchiveStory';
import useFetchAllUserPosts from 'modules/insights/hooks/useFetchAllUserPosts';
import { mapIndexed } from 'utils/ramdaUtils';
import { recentStoriesListCountSelector, postsPageInfoSelector } from 'modules/instagram/selector';
import { useCheckPremium } from 'modules/purchase/hook/useCheckPremium';

const { width: screenWidth } = Dimensions.get('window');

const StyledView = styled(ScrollView).attrs(props => ({
  contentContainerStyle: {
    paddingHorizontal: 12,
    paddingTop: 0,
    paddingBottom: '28%',
  },
}))`
  flex: 1;
  background-color: ${path(['theme', 'screenBackground'])};
`;

const ListWrapper = styled(View)`
  margin-vertical: 20;
  width: 100%;
`;

const Title = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
`;

const StyledIconList = styled(IconListItem)`
  margin-top: ${pathOr(12, ['margin'])};
  width: ${(screenWidth - 35) / 2};
  padding-right: 12;
  padding-left: 12;
`;

const StyledRecentStoriesSlider = styled(RecentStorySlider)`
  margin-top: 16;
`;

const storyInsightList = [
  {
    iconSource: require('assets/icons/history.png'),
    description: 'History',
    route: 'StoryHistory',
  },
  {
    iconSource: require('assets/icons/followstatus_best.png'),
    description: 'Top viewers',
    route: 'TopViewers',
  },
  {
    iconSource: require('assets/icons/followstatus_ghost.png'),
    description: 'Least viewers',
    route: 'LeastViewers',
  },
  {
    iconSource: require('assets/icons/mostviewed.png'),
    description: 'Most viewed storyies',
    route: 'MostViewedStories',
  },
  {
    iconSource: require('assets/icons/leastviewed.png'),
    description: 'Least viewed storyies',
    route: 'LeastViewedStories',
  },
];

const postInsightList = [
  {
    iconSource: require('assets/icons/popular.png'),
    description: 'Most popular posts',
    route: 'MostPopularPosts',
  },
  {
    iconSource: require('assets/icons/mostliked.png'),
    description: 'Most liked posts',
    route: 'MostLikedPosts',
  },
  {
    iconSource: require('assets/icons/mostcommend.png'),
    description: 'Most commented posts',
    route: 'MostCommentedPosts',
  },
];

const TwoColumnViewWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const selector = createStructuredSelector({
  recentStoriesCount: recentStoriesListCountSelector,
  postsPageInfo: postsPageInfoSelector,
});

const InsightScreen = ({ navigation }) => {
  const { recentStoriesCount, postsPageInfo } = useSelector(selector);
  const [refreshing, setRefreshing] = React.useState(false);
  const { effectAction, updatedAt: archiveUpdatedAt } = useFetchArchiveStory();
  useFetchAllUserPosts(postsPageInfo?.end_cursor);
  const onRefresh = React.useCallback(() => {
    const callbackAction = async () => {
      setRefreshing(true);
      await effectAction();
      setRefreshing(false);
    };
    callbackAction();
  }, []);
  const { checkPremium } = useCheckPremium();
  return (
    <StyledView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {recentStoriesCount !== 0 && (
        <ListWrapper>
          <Title>Recent Stories</Title>
          <StyledRecentStoriesSlider updatedAt={archiveUpdatedAt} />
        </ListWrapper>
      )}
      <ListWrapper>
        <Title>Story Insights</Title>
        <TwoColumnViewWrapper>
          {mapIndexed((item, idx) => (
            <StyledIconList
              key={idx}
              {...item}
              onPress={checkPremium(() => item.route && navigation.navigate(item.route))}
            />
          ))(storyInsightList)}
        </TwoColumnViewWrapper>
      </ListWrapper>
      <ListWrapper>
        <Title>Post Insights</Title>
        <TwoColumnViewWrapper>
          {mapIndexed((item, idx) => (
            <StyledIconList
              key={idx}
              {...item}
              onPress={checkPremium(() => item.route && navigation.navigate(item.route))}
            />
          ))(postInsightList)}
        </TwoColumnViewWrapper>
      </ListWrapper>
    </StyledView>
  );
};

InsightScreen.propTypes = {
  navigation: PropTypes.object,
};

export default InsightScreen;
