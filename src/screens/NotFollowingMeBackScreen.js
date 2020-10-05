import * as React from 'react';
import { createStructuredSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import { path } from 'ramda';
import styled from 'styled-components/native';

import UserListItem from 'components/UserListItem';
import { notFollowingMeBackSelector } from 'modules/instagram/selector';

const LocalUserListItem = props => <UserListItem {...props} isFollower={false} isFollowing />;

const selector = createStructuredSelector({
  users: notFollowingMeBackSelector,
});

const ListItem = ({ item }) => (
  <LocalUserListItem
    username={item.username}
    key={item.id}
    userId={item.id}
    profilePicture={item.profile_pic_url}
  />
);

const NotFollowingMeBackScreen = () => {
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

export default NotFollowingMeBackScreen;

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
