import * as React from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { createStructuredSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { FlatList, Text } from 'react-native';
import styled from 'styled-components/native';

import UserListItem from 'components/UserListItem';
import { unFollowersWithProfileSelector } from 'modules/instagram/selector';

const selectors = createStructuredSelector({
  users: unFollowersWithProfileSelector,
});

const Description = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
`;

const LocalUserListItem = ({ timestamp, ...rest }) => (
  <UserListItem
    {...rest}
    isFollower={false}
    descriptionElement={
      <Description>Unfollowed: {new Date(timestamp).toLocaleDateString()}</Description>
    }
  />
);

LocalUserListItem.propTypes = {
  timestamp: PropTypes.number,
};

const ListItem = ({ item }) => (
  <LocalUserListItem
    profilePicture={item?.profile?.profile_pic_url}
    timestamp={item?.updatedAt}
    username={item?.profile?.username}
    isFollowing={item?.profile?.followed_by_viewer}
    userId={item?.profile?.id}
    key={item?.profile?.id}
  />
);

const UnfollowersScreen = () => {
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

export default UnfollowersScreen;

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
