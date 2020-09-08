import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';

import UserListItem from 'components/UserListItem';

const BestFollowersScreen = () => {
  //   const users = [
  //     {
  //       username: 'gordon',
  //       isFollower: true,
  //       isFollowing: true,
  //       time: 'Today',
  //       likes: 99,
  //       comments: 88,
  //     },
  //     {
  //       username: 'gordon',
  //       isFollower: true,
  //       isFollowing: false,
  //       time: '07-23-2020',
  //       likes: 99,
  //       comments: 88,
  //     },
  //     {
  //       username: 'gordon',
  //       isFollower: false,
  //       isFollowing: true,
  //       time: 'Today',
  //       likes: 99,
  //       comments: 88,
  //     },
  //     {
  //       username: 'gordon',
  //       isFollower: false,
  //       isFollowing: false,
  //       time: '07-23-2020',
  //       likes: 99,
  //       comments: 88,
  //     },
  //   ];

  //   const LocalUserListItem = ({ username, isFollower, isFollowing, likes, comments }) => (
  //     <UserListItem
  //       username={username}
  //       isFollower={isFollower}
  //       isFollowing={isFollowing}
  //       buttonHide
  //       iconType="like"
  //       value={likes}
  //     />
  //   );
  //   return (
  //     <StyledView>
  //       {users.map((user, index) => (
  //         <LocalUserListItem {...user} key={index} />
  //       ))}
  //     </StyledView>
  //   );
  return (
    <View>
      <Text>best followers</Text>
    </View>
  );
};

export default BestFollowersScreen;

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
