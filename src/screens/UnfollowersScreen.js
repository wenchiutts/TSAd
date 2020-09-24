import * as React from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { createStructuredSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { ScrollView, Text } from 'react-native';
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

const UnfollowersScreen = () => {
  const { users } = useSelector(selectors);

  return (
    <StyledView>
      {users.map(user => (
        <LocalUserListItem
          profilePicture={user?.profile?.profile_pic_url}
          timestamp={user?.updatedAt}
          username={user?.profile?.username}
          isFollowing={user?.profile?.followed_by_viewer}
          userId={user?.profile?.id}
          key={user?.profile?.id}
        />
      ))}
    </StyledView>
  );
};

export default UnfollowersScreen;

const StyledView = styled(ScrollView).attrs({
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '22%',
    paddingHorizontal: 20,
  },
})`
  flex: 1;
`;
