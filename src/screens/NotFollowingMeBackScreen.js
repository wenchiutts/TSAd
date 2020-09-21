import * as React from 'react';
import { createStructuredSelector } from 'reselect';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { map } from 'ramda';

import UserListItem from 'components/UserListItem';
import { notFollowingMeBackSelector } from 'modules/instagram/selector';

const LocalUserListItem = props => <UserListItem {...props} isFollower={false} isFollowing />;

const selector = createStructuredSelector({
  users: notFollowingMeBackSelector,
});

const NotFollowingMeBackScreen = () => {
  const { users } = useSelector(selector);

  return (
    <StyledView>
      {map(user => (
        <LocalUserListItem
          username={user.username}
          key={user.id}
          userId={user.id}
          profilePicture={user.profile_pic_url}
        />
      ))(users)}
    </StyledView>
  );
};

export default NotFollowingMeBackScreen;

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
