import * as React from 'react';
import { createStructuredSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import { path } from 'ramda';
import styled from 'styled-components/native';

import UserListItem from 'components/UserListItem';
import { mutualFollowingSelector } from 'modules/instagram/selector';

const LocalUserListItem = props => <UserListItem isFollower isFollowing {...props} />;

const selector = createStructuredSelector({
  users: mutualFollowingSelector,
});

const ListItem = ({ item }) => (
  <LocalUserListItem
    key={item.id}
    username={item.username}
    profilePicture={item.profile_pic_url}
    userId={item.id}
  />
);

const MutualFollowingScreen = () => {
  const { users } = useSelector(selector);

  return (
    <StyledView
      data={users}
      initialNumToRender={10}
      renderItem={ListItem}
      keyExtractor={path(['id'])}
    />
  );
};

export default MutualFollowingScreen;

const StyledView = styled(FlatList).attrs({
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
})`
  flex: 1;
`;
