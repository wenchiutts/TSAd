import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';

import UserListItem from 'components/UserListItem';
import CategoryButton from 'components/CategoryButton';

const GhostFollowersScreen = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const users = [
    {
      username: 'gordon',
      isFollower: true,
      isFollowing: true,
      time: 'Today',
      likes: 99,
      comments: 88,
    },
    {
      username: 'gordon',
      isFollower: true,
      isFollowing: false,
      time: '07-23-2020',
      likes: 66,
      comments: 33,
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: true,
      time: 'Today',
      likes: 444,
      comments: 56,
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: false,
      time: '07-23-2020',
      likes: 8678,
      comments: 123,
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: true,
      time: 'Today',
      likes: 444,
      comments: 0,
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: false,
      time: '07-23-2020',
      likes: 0,
      comments: 123,
    },
  ];

  const sortedUsers = (users, category) => {
    if (category === 0) {
      return users.filter(user => user.likes === 0);
    }
    if (category === 1) {
      return users.filter(user => user.comments === 0);
    }
  };

  const LocalUserListItem = ({ username, isFollower, isFollowing }) => (
    <UserListItem
      username={username}
      isFollower={isFollower}
      isFollowing={isFollowing}
      descriptionHide
    />
  );

  return (
    <StyledView>
      <ButtonWrapper>
        <CategoryButton
          text="No Like"
          index={0}
          active={activeIndex === 0 && true}
          setActiveIndex={setActiveIndex}
        />
        <CategoryButton
          text="No Comment"
          index={1}
          active={activeIndex === 1 && true}
          setActiveIndex={setActiveIndex}
        />
      </ButtonWrapper>
      <ListWrapper>
        {sortedUsers(users, activeIndex).map((user, index) => (
          <LocalUserListItem {...user} key={index} />
        ))}
      </ListWrapper>
    </StyledView>
  );
};

export default GhostFollowersScreen;

const StyledView = styled(View)`
  justify-content: flex-start;
  align-items: center;
  padding-top: 25%;
  padding-horizontal: 20;
  flex: 1;
`;

const ButtonWrapper = styled(View)`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: 3%;
`;

const ListWrapper = styled(ScrollView)`
  width: 100%;
`;
