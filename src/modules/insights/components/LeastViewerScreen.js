// @format
import * as React from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { View, FlatList, Text } from 'react-native';
import { compose, path } from 'ramda';
import styled from 'styled-components/native';

import { archivesLeastViewerListSelector } from 'modules/instagram/selector';
import UserListItem from 'components/UserListItem';

const selector = createStructuredSelector({
  viewers: archivesLeastViewerListSelector,
});

const Description = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
`;

const ListItem = ({ item }) => (
  <UserListItem
    isFollower={item.isFollower}
    isFollowing={item.isFollowing}
    username={item.user.username}
    profilePicture={item.user.profile_pic_url}
    userId={item.user.pk}
    descriptionElement={<Description>viewed {item.count} stories</Description>}
  />
);

const TopViewerScreen = () => {
  const { viewers } = useSelector(selector);

  return (
    <View>
      <FlatList
        data={viewers}
        keyExtractor={compose(String, path(['user', 'pk']))}
        renderItem={ListItem}
        initialNumToRender={10}
      />
    </View>
  );
};

export default TopViewerScreen;
