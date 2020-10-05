import * as React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { path } from 'ramda';

import PostItem, { POST_ITEM_WIDTH } from 'components/PostItem';
import { postsByPopularitySelector } from 'modules/instagram/selector';

const postImgSelector = path(['thumbnail_resources', 0, 'src']);
const commentCountSelector = path(['edge_media_to_comment', 'count']);
const likesSelector = path(['edge_media_preview_like', 'count']);

const GridItem = ({ item }) => (
  <PostItem
    likes={likesSelector(item)}
    comments={commentCountSelector(item)}
    src={{ uri: postImgSelector(item) }}
  />
);

const selector = createStructuredSelector({
  post: postsByPopularitySelector,
});

const MostPopularPostsScreen = () => {
  const { post } = useSelector(selector);
  return (
    <SafeAreaView>
      <FlatList
        columnWrapperStyle={{ justifyContent: 'flex-start', height: POST_ITEM_WIDTH }}
        data={post}
        numColumns={3}
        keyExtractor={path(['id'])}
        initialNumToRender={18}
        renderItem={GridItem}
        getItemLayout={(data, index) => ({
          length: POST_ITEM_WIDTH,
          offset: POST_ITEM_WIDTH * index,
          index,
        })}
      />
    </SafeAreaView>
  );
};

export default MostPopularPostsScreen;
