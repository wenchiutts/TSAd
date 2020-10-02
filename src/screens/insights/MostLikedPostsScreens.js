import * as React from 'react';
import { createStructuredSelector } from 'reselect';
import { SafeAreaView, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { path } from 'ramda';

import PostItem from 'components/PostItem';
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
        columnWrapperStyle={{ justifyContent: 'flex-start' }}
        initialNumToRender={6}
        data={posts}
        numColumns={3}
        keyExtractor={path(['id'])}
        renderItem={GridItem}
      />
    </SafeAreaView>
  );
};
export default MostLikedPostsScreen;
