import * as React from 'react';
import { FlatList, SafeAreaView } from 'react-native';

import PostItem from 'components/PostItem';

const postsData = [
  {
    likes: 989,
    comments: 23,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/7WQZUEU75C.jpg' },
  },
  {
    likes: 98229,
    comments: 23423,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/TXGQ76N3J0.jpg' },
  },
  {
    likes: 777,
    comments: 22,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/DJQQTMR8XV.jpg' },
  },
  {
    likes: 857,
    comments: 5544,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/XLYI8D8H5R.jpg' },
  },
  {
    likes: 2222,
    comments: 456,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/8N1P2AHD0W.jpg' },
  },
  {
    likes: 444,
    comments: 666,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/FC9HYIWC9B.jpg' },
  },
  {
    likes: 22,
    comments: 7777,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/8BY0ULY9GK.jpg' },
  },
  {
    likes: 333,
    comments: 678,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/SFJPODPJY4.jpg' },
  },
  {
    likes: 989,
    comments: 23,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/7WQZUEU75C.jpg' },
  },
  {
    likes: 98229,
    comments: 23423,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/TXGQ76N3J0.jpg' },
  },
  {
    likes: 777,
    comments: 22,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/DJQQTMR8XV.jpg' },
  },
  {
    likes: 857,
    comments: 5544,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/XLYI8D8H5R.jpg' },
  },
  {
    likes: 2222,
    comments: 456,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/8N1P2AHD0W.jpg' },
  },
  {
    likes: 444,
    comments: 666,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/FC9HYIWC9B.jpg' },
  },
  {
    likes: 989,
    comments: 23,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/7WQZUEU75C.jpg' },
  },
  {
    likes: 98229,
    comments: 23423,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/TXGQ76N3J0.jpg' },
  },
  {
    likes: 777,
    comments: 22,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/DJQQTMR8XV.jpg' },
  },
  {
    likes: 857,
    comments: 5544,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/XLYI8D8H5R.jpg' },
  },
  {
    likes: 2222,
    comments: 456,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/8N1P2AHD0W.jpg' },
  },
  {
    likes: 444,
    comments: 666,
    src: { uri: 'https://snap-photos.s3.amazonaws.com/img-thumbs/960w/FC9HYIWC9B.jpg' },
  },
];

const MostPopularPostsScreen = () => (
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

export default MostPopularPostsScreen;
