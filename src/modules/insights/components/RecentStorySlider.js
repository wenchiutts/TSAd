// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components/native';
import { View, FlatList } from 'react-native';
import { path, pluck } from 'ramda';

import { recentStoriesListSelector } from 'modules/instagram/selector';
import StoryGridItem from 'modules/insights/components/StoryGridItem';
import useFetchReelsMediaViewer from 'modules/insights/hooks/useFetchReelsMediaViewer';

const StyledStoryItem = styled(StoryGridItem)`
  width: 66;
  height: 117.5;
  border-radius: 4;
  margin-right: 12;
  overflow: hidden;
`;

const StoryItem = ({ item }) => (
  <StyledStoryItem
    storyId={path(['id'], item)}
    imgSrc={path(['image_versions2', 'candidates', 3, 'url'], item)}
    viewsCount={path(['total_viewer_count'], item)}
  />
);

const selector = createStructuredSelector({
  recentStories: recentStoriesListSelector,
});

const RecentStoriesList = styled(FlatList).attrs(props => ({
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
}))`
  height: 117.5;
`;
const RecentStorySlider = ({ style, updatedAt }) => {
  const { recentStories } = useSelector(selector);
  useFetchReelsMediaViewer({ ids: pluck('id', recentStories), updatedAt }, [updatedAt]);

  return (
    <View style={style}>
      <RecentStoriesList
        data={recentStories}
        keyExtractor={path(['id'])}
        horizontal
        renderItem={StoryItem}
        initialNumToRender={5}
      />
    </View>
  );
};

RecentStorySlider.propTypes = {
  style: PropTypes.array,
  updatedAt: PropTypes.number,
};

export default React.memo(RecentStorySlider);
