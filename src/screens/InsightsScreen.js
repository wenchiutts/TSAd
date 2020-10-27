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
import i18n from 'i18n';
import apis from 'apis';

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
    description: i18n.t('insight_history'),
    route: 'StoryHistory',
  },
  {
    iconSource: require('assets/icons/followstatus_best.png'),
    description: i18n.t('insight_top_viewers'),
    route: 'TopViewers',
  },
  {
    iconSource: require('assets/icons/followstatus_ghost.png'),
    description: i18n.t('insight_least_viewers'),
    route: 'LeastViewers',
  },
  {
    iconSource: require('assets/icons/mostviewed.png'),
    description: i18n.t('insight_most_viewed_stories'),
    route: 'MostViewedStories',
  },
  {
    iconSource: require('assets/icons/leastviewed.png'),
    description: i18n.t('insight_least_viewed_stories'),
    route: 'LeastViewedStories',
  },
];

const postInsightList = [
  {
    iconSource: require('assets/icons/popular.png'),
    description: i18n.t('insight_most_popular_posts'),
    route: 'MostPopularPosts',
  },
  {
    iconSource: require('assets/icons/mostliked.png'),
    description: i18n.t('insight_most_liked_posts'),
    route: 'MostLikedPosts',
  },
  {
    iconSource: require('assets/icons/mostcommend.png'),
    description: i18n.t('insight_most_commented_posts'),
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

  const logEvent = route => apis.firebase.logEvent({ name: `onPress_insight_${route}` });

  const onPress = item => {
    const premium = checkPremium(() => item.route && navigation.navigate(item.route));
    premium();
    logEvent(item.route);
  };

  return (
    <StyledView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {recentStoriesCount !== 0 && (
        <ListWrapper>
          <Title>{i18n.t('insight_recent_stories')}</Title>
          <StyledRecentStoriesSlider updatedAt={archiveUpdatedAt} />
        </ListWrapper>
      )}
      <ListWrapper>
        <Title>{i18n.t('insight_story_insight')}</Title>
        <TwoColumnViewWrapper>
          {mapIndexed((item, idx) => (
            <StyledIconList key={idx} {...item} onPress={() => onPress(item)} />
          ))(storyInsightList)}
        </TwoColumnViewWrapper>
      </ListWrapper>
      <ListWrapper>
        <Title>{i18n.t('insight_post_insight')}</Title>
        <TwoColumnViewWrapper>
          {mapIndexed((item, idx) => (
            <StyledIconList key={idx} {...item} onPress={() => onPress(item)} />
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
