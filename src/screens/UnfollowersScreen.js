import * as React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import UserListItem from 'components/UserListItem';

const UnfollowersScreen = () => {
  const users = [
    {
      username: 'gordon',
      isFollower: true,
      isFollowing: true,
      time: 'Today',
    },
    {
      username: 'gordon',
      isFollower: true,
      isFollowing: false,
      time: '07-23-2020',
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: true,
      time: 'Today',
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: false,
      time: '07-23-2020',
    },
  ];

  const LocalUserListItem = ({ username, isFollowing, time }) => (
    <UserListItem
      username={username}
      isFollower={false}
      isFollowing={isFollowing}
      time={time}
      descriptionText="Unfollowed"
    />
  );
  return (
    <StyledView>
      {users.map((user, index) => {
        if (!user.isFollower) {
          return <LocalUserListItem {...user} key={index} />;
        }
      })}
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
