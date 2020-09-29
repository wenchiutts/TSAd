import * as React from 'react';
import { SafeAreaView, FlatList } from 'react-native';

import PostItem from 'components/PostItem';

const postsData = [
  {
    likes: 989,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/7WQZUEU75C.jpg' },
  },
  {
    likes: 98229,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/TXGQ76N3J0.jpg' },
  },
  {
    likes: 777,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/DJQQTMR8XV.jpg' },
  },
  {
    likes: 857,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/XLYI8D8H5R.jpg' },
  },
  {
    likes: 2222,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/8N1P2AHD0W.jpg' },
  },
  {
    likes: 444,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/FC9HYIWC9B.jpg' },
  },
  {
    likes: 22,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/8BY0ULY9GK.jpg' },
  },
  {
    likes: 333,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/SFJPODPJY4.jpg' },
  },
  {
    likes: 989,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/7WQZUEU75C.jpg' },
  },
  {
    likes: 98229,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/TXGQ76N3J0.jpg' },
  },
  {
    likes: 777,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/DJQQTMR8XV.jpg' },
  },
  {
    likes: 857,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/XLYI8D8H5R.jpg' },
  },
  {
    likes: 2222,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/8N1P2AHD0W.jpg' },
  },
  {
    likes: 444,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/FC9HYIWC9B.jpg' },
  },
  {
    likes: 989,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/7WQZUEU75C.jpg' },
  },
  {
    likes: 98229,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/TXGQ76N3J0.jpg' },
  },
  {
    likes: 777,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/DJQQTMR8XV.jpg' },
  },
  {
    likes: 857,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/XLYI8D8H5R.jpg' },
  },
  {
    likes: 2222,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/8N1P2AHD0W.jpg' },
  },
  {
    likes: 444,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/FC9HYIWC9B.jpg' },
  },
];

const MostLikedPostsScreen = () => (
  <SafeAreaView>
    <FlatList
      columnWrapperStyle={{ justifyContent: 'flex-start' }}
      data={postsData}
      numColumns={3}
      keyExtractor={(item, index) => index}
      renderItem={({ item }) => <PostItem {...item} />}
    />
  </SafeAreaView>
);
export default MostLikedPostsScreen;
