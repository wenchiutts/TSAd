import * as React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { path } from 'ramda';
import { FlatList, Text } from 'react-native';
import styled from 'styled-components/native';

import UserListItem from 'components/UserListItem';
import { newFollowersWithProfileSelector } from 'modules/instagram/selector';

const Description = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
`;

const LocalUserListItem = ({ timestamp, ...rest }) => (
  <UserListItem
    {...rest}
    isFollower
    descriptionElement={
      <Description>Followed: {new Date(timestamp).toLocaleDateString()}</Description>
    }
  />
);

LocalUserListItem.propTypes = {
  timestamp: PropTypes.number,
};

const ListItem = ({ item }) => (
  <LocalUserListItem
    profilePicture={item?.profile?.profile_pic_url}
    username={item?.profile?.username}
    isFollowing={item?.profile?.followed_by_viewer}
    timestamp={item?.createdAt}
    userId={item?.profile?.id}
    key={item?.profile?.id}
  />
);

const selectors = createStructuredSelector({
  users: newFollowersWithProfileSelector,
});

const NewFollowersScreen = () => {
  const { users } = useSelector(selectors);

  return (
    <StyledView
      data={users}
      initialNumToRender={10}
      renderItem={ListItem}
      keyExtractor={path(['id'])}
    />
  );
};

export default NewFollowersScreen;

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
