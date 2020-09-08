import * as React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import UserListItem from 'components/UserListItem';

const ViewMyProfileScreen = () => {
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
      time: 'Today',
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: true,
      time: '07-23-2020',
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: false,
      time: '07-23-2020',
    },
  ];

  const LocalUserListItem = ({ username, isFollower, isFollowing, time }) => (
    <UserListItem
      username={username}
      isFollower={isFollower}
      isFollowing={isFollowing}
      time={time}
      descriptionText="Viewed"
    />
  );
  return (
    <StyledView>
      {users.map((user, index) => {
        if (user.time) {
          return <LocalUserListItem {...user} key={index} />;
        }
      })}
    </StyledView>
  );
};

export default ViewMyProfileScreen;

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
