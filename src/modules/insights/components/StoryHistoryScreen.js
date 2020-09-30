// @format
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { View, FlatList } from 'react-native';
import { path } from 'ramda';
// import styled from 'styled-components/native';

import StoryGridItem from 'modules/insights/components/StoryGridItem';
import { fetchUserArchiveStoryies } from 'modules/instagram/insAuthActions';
import { archivesListSelector } from 'modules/instagram/selector';

const selector = createStructuredSelector({
  archiveStory: archivesListSelector,
});

const GridItem = ({ item }) => (
  <StoryGridItem
    imgSrc={path(['items', 'image_versions', 0, 'url'], item)}
    viewsCount={path(['items', 'total_viewer_count'], item)}
  />
);

const StoryHistoryScreen = () => {
  const dispatch = useDispatch();
  const { archiveStory } = useSelector(selector);

  React.useEffect(() => {
    const effectAction = async () => {
      await dispatch(fetchUserArchiveStoryies());
    };

    effectAction();
  }, []);

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
