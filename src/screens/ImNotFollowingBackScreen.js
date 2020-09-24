import * as React from 'react';
import { createStructuredSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import UserListItem from 'components/UserListItem';
import { imNotFollowingBackSelector } from 'modules/instagram/selector';

const LocalUserListItem = props => <UserListItem isFollower isFollowing={false} {...props} />;

const selector = createStructuredSelector({
  users: imNotFollowingBackSelector,
});

const ImNotFollowingBackScreen = () => {
  const { users } = useSelector(selector);

  return (
    <StyledView>
      {users.map(user => (
        <LocalUserListItem
          key={user.id}
          username={user.username}
          profilePicture={user.profile_pic_url}
          userId={user.id}
        />
      ))}
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
