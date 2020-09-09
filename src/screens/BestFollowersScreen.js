import * as React from 'react';
import { View, Text, ScrollView, TouchableHighlight, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

import UserListItem from 'components/UserListItem';

const { width: screenWidth } = Dimensions.get('window');

const BestFollowersScreen = () => {
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
  ];

  const sortedUsers = (users, category) => {
    if (category === 0) {
      return users.sort((a, b) => b.likes - a.likes);
    }
    if (category === 1) {
      return users.sort((a, b) => b.comments - a.comments);
    }
  };

  const CategoryButton = ({ text, active }) => (
    <StyledButton
      active={active}
      onPress={() => {
        if (text === 'Like') {
          setActiveIndex(0);
        }
        if (text === 'Comment') {
          setActiveIndex(1);
        }
      }}>
      <StyledText>{text}</StyledText>
    </StyledButton>
  );

  const LocalUserListItem = ({ username, isFollower, isFollowing, likes, comments }) => (
    <UserListItem
      username={username}
      isFollower={isFollower}
      isFollowing={isFollowing}
      buttonHide
      iconType={activeIndex === 0 ? 'like' : 'comment'}
      value={activeIndex === 0 ? likes : comments}
    />
  );
  return (
    <StyledView>
      <ButtonWrapper>
        <CategoryButton text="Like" active={activeIndex === 0 && true} />
        <CategoryButton text="Comment" active={activeIndex === 1 && true} />
      </ButtonWrapper>
      <ListWrapper>
        {sortedUsers(users, activeIndex).map((user, index) => (
          <LocalUserListItem {...user} key={index} />
        ))}
      </ListWrapper>
    </StyledView>
  );
};

export default BestFollowersScreen;

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

const StyledButton = styled(TouchableHighlight)`
  background-color: ${props =>
    props.active ? path(['theme', 'buttonActiveBackground']) : path(['theme', 'listItemBg'])};
  height: 28;
  border-radius: 14;
  width: ${(screenWidth - 50) / 2};
`;

const StyledText = styled(Text)`
  color: ${path(['theme', 'noticeText'])};
  font-size: 16;
  line-height: 28;
  text-align: center;
`;

const ListWrapper = styled(ScrollView)`
  width: 100%;
`;
