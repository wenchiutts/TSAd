// @format
import * as React from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { View, FlatList } from 'react-native';
import { path } from 'ramda';
// import styled from 'styled-components/native';

import StoryGridItem from 'modules/insights/components/StoryGridItem';
import { archivesListSelector } from 'modules/instagram/selector';

const selector = createStructuredSelector({
  archiveStory: archivesListSelector,
});

const GridItem = ({ item }) => (
  <StoryGridItem
    storyId={path(['id'], item)}
    imgSrc={path(['image_versions2', 'candidates', 3, 'url'], item)}
    viewsCount={path(['total_viewer_count'], item)}
  />
);

const StoryHistoryScreen = () => {
  const { archiveStory } = useSelector(selector);

  return (
    <View>
      <FlatList
        columnWrapperStyle={{ justifyContent: 'flex-start' }}
        data={archiveStory}
        numColumns={3}
        keyExtractor={path(['id'])}
        renderItem={GridItem}
        initialNumToRender={10}
      />
    </View>
  );
};

export default StoryHistoryScreen;
