import * as React from 'react';
import { createStructuredSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { FlatList, SafeAreaView } from 'react-native';
import { path } from 'ramda';

import PostItem from 'components/PostItem';
import { postByCommentCountSelector } from 'modules/instagram/selector';

const postImgSelector = path(['thumbnail_resources', 0, 'src']);
const commentCountSelector = path(['edge_media_to_comment', 'count']);
const selector = createStructuredSelector({
  posts: postByCommentCountSelector,
});

const GridItem = ({ item }) => (
  <PostItem comments={commentCountSelector(item)} src={{ uri: postImgSelector(item) }} />
);

const MostCommentedPostsScreen = () => {
  const { posts } = useSelector(selector);
  return (
    <SafeAreaView>
      <FlatList
        columnWrapperStyle={{ justifyContent: 'flex-start' }}
        initialNumToRender={18}
        data={posts}
        numColumns={3}
        keyExtractor={path(['id'])}
        renderItem={GridItem}
      />
    </SafeAreaView>
  );
};

export default MostCommentedPostsScreen;
