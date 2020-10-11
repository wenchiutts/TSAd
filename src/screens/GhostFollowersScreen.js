import * as React from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

import UserListItem from 'components/UserListItem';
import ActiveStateButton from 'components/ActiveStateButton';
import { ghostFollowerSelector } from '../modules/instagram/selector';

const LocalUserListItem = ({ username, isFollowing, profilePicture }) => (
  <UserListItem
    username={username}
    isFollower
    isFollowing={isFollowing}
    profilePicture={profilePicture}
  />
);

const selector = createStructuredSelector({
  users: ghostFollowerSelector,
});

const ListItem = ({ item }) => (
  <LocalUserListItem
    username={item?.profile?.username}
    profilePicture={item?.profile?.profile_pic_url}
    userId={item?.profile?.id}
    isFollowing={item?.profile?.followed_by_viewer}
  />
);
const GhostFollowersScreen = () => {
  // const [activeIndex, setActiveIndex] = React.useState(0);
  const { users } = useSelector(selector);

  return (
    <StyledView>
      {false && (
        <ButtonWrapper>
          <ActiveStateButton
            text="No Like"
            isActive={activeIndex === 0}
            onPress={() => setActiveIndex(0)}
          />
          <ActiveStateButton
            text="No Comment"
            isActive={activeIndex === 1}
            onPress={() => setActiveIndex(1)}
          />
        </ButtonWrapper>
      )}
      <ListWrapper
        data={users}
        initialNumToRender={10}
        renderItem={ListItem}
        keyExtractor={path(['profile', 'id'])}
      />
    </StyledView>
  );
};

export default GhostFollowersScreen;

const StyledView = styled(View)`
  justify-content: flex-start;
  align-items: center;
  padding-top: 10;
  padding-horizontal: 20;
  flex: 1;
`;

const ButtonWrapper = styled(View)`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: 3%;
`;

const ListWrapper = styled(FlatList)`
  width: 100%;
`;
