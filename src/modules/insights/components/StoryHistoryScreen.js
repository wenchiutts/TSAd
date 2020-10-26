// @format
import * as React from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { View, FlatList } from 'react-native';
import { path } from 'ramda';
import styled from 'styled-components/native';

import StoryGridItem from 'modules/insights/components/StoryGridItem';
import { archivesListSelector } from 'modules/instagram/selector';
import EmptyStatusView from 'components/EmptyStatusView';

const selector = createStructuredSelector({
  archiveStory: archivesListSelector,
});

const StyledEmptyView = styled(EmptyStatusView)`
  width: 100%;
`;

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
        contentContainerStyle={{
          flexGrow: 1,
          flexBasis: '100%',
        }}
        ListEmptyComponent={<StyledEmptyView text="story" />}
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
