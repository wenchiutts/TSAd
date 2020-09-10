import * as React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

import UserListItem from 'components/UserListItem';
import ActiveStateButton from 'components/ActiveStateButton';

const LocalUserListItem = ({ username, isFollower, isFollowing, likes, comments, activeIndex }) => (
  <UserListItem
    username={username}
    isFollower={isFollower}
    isFollowing={isFollowing}
    buttonHide
    descriptionElement={
      <DescriptionWrapper
        iconType={activeIndex === 0 ? 'like' : 'comment'}
        value={activeIndex === 0 ? likes : comments}
      />
    }
  />
);

const DescriptionWrapper = ({ iconType, value }) => (
  <View style={{ height: 18, flexDirection: 'row' }}>
    {iconType === 'like' && <StyledImage source={require('assets/icons/like_small.png')} />}
    {iconType === 'comment' && <StyledImage source={require('assets/icons/comment_small.png')} />}
    <Description>{value}</Description>
  </View>
);

const StyledImage = styled(Image)`
  width: 20;
  height: 20;
  margin-right: 8;
`;

const Description = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
`;

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

  return (
    <StyledView>
      <ButtonWrapper>
        <ActiveStateButton
          text="Like"
          isActive={activeIndex === 0}
          onPress={() => setActiveIndex(0)}
        />
        <ActiveStateButton
          text="Comment"
          isActive={activeIndex === 1}
          onPress={() => setActiveIndex(1)}
        />
      </ButtonWrapper>
      <ListWrapper>
        {sortedUsers(users, activeIndex).map((user, index) => (
          <LocalUserListItem {...user} key={index} activeIndex={activeIndex} />
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

const ListWrapper = styled(ScrollView)`
  width: 100%;
`;
