import * as React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { path } from 'ramda';
import { ScrollView, Text } from 'react-native';
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

const selectors = createStructuredSelector({
  users: newFollowersWithProfileSelector,
});

const NewFollowersScreen = () => {
  const { users } = useSelector(selectors);

  return (
    <StyledView>
      {users.map((user, index) => (
        <LocalUserListItem
          profilePicture={user?.profile?.profile_pic_url}
          username={user?.profile?.username}
          isFollowing={user?.profile?.followed_by_viewer}
          timestamp={user?.createdAt}
          userId={user?.profile?.id}
          key={user?.profile?.id}
        />
      ))}
    </StyledView>
  );
};

export default NewFollowersScreen;

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
