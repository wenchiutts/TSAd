import * as React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import UserListItem from 'components/UserListItem';

const ImNotFollowingBackScreen = () => {
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

  const LocalUserListItem = ({ username, time }) => (
    <UserListItem username={username} isFollower isFollowing={false} time={time} descriptionHide />
  );
  return (
    <StyledView>
      {users.map((user, index) => {
        if (user.isFollower && !user.isFollowing) {
          return <LocalUserListItem {...user} key={index} />;
        }
      })}
    </StyledView>
  );
};

export default ImNotFollowingBackScreen;

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
