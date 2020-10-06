import * as React from 'react';
import { createStructuredSelector } from 'reselect';
import { SafeAreaView, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { path } from 'ramda';

import PostItem, { POST_ITEM_WIDTH } from 'components/PostItem';
import { postByLikedCountSelector } from 'modules/instagram/selector';

const selector = createStructuredSelector({
  posts: postByLikedCountSelector,
});

const likesSelector = path(['edge_media_preview_like', 'count']);
const postImgSelector = path(['thumbnail_resources', 0, 'src']);

const GridItem = ({ item }) => (
  <PostItem likes={likesSelector(item)} src={{ uri: postImgSelector(item) }} />
);

const MostLikedPostsScreen = () => {
  const { posts } = useSelector(selector);
  return (
    <SafeAreaView>
      <FlatList
        columnWrapperStyle={{ justifyContent: 'flex-start', height: POST_ITEM_WIDTH }}
        initialNumToRender={18}
        data={posts}
        numColumns={3}
        keyExtractor={path(['id'])}
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
export default MostLikedPostsScreen;
