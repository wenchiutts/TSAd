import * as React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

import { Avatar } from 'components/AvatarImage';
import { followUserAction, unfollowUserAction } from 'modules/instagram/insAuthActions';

const UserListItem = ({
  username,
  isFollower,
  isFollowing,
  buttonHide,
  descriptionElement,
  profilePicture,
  userId,
  roundedWidth,
  isExistStory,
  style,
}) => {
  const dispatch = useDispatch();
  const follow = () => dispatch(followUserAction(userId));
  const unfollow = () => dispatch(unfollowUserAction(userId));
  return (
    <Wrapper style={style}>
      <Avatar
        source={{ uri: profilePicture }}
        isFollower={isFollower}
        isFollowing={isFollowing}
        roundedWidth={roundedWidth}
        isExistStory={isExistStory}
      />
      <TextWrapper>
        <Username>@{username}</Username>
        {descriptionElement}
      </TextWrapper>
      {!buttonHide ? (
        <FollowButton isFollowing={isFollowing} onPress={isFollowing ? unfollow : follow} />
      ) : (
        <></>
      )}
    </Wrapper>
  );
};

UserListItem.propTypes = {
  username: PropTypes.string,
  isFollower: PropTypes.bool,
  isFollowing: PropTypes.bool,
  buttonHide: PropTypes.bool,
  descriptionElement: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  profilePicture: PropTypes.string,
  userId: PropTypes.string,
  roundedWidth: PropTypes.number,
  style: PropTypes.array,
};

export default UserListItem;

const Wrapper = styled(View)`
  margin-vertical: 16;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const TextWrapper = styled(View)`
  margin-left: 20;
`;

const Username = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 16;
  font-weight: bold;
  margin-bottom: 8;
`;

const FollowButton = ({ isFollowing, onPress }) => (
  <ButtonWrapper isFollowing={isFollowing} onPress={onPress}>
    <ButtonText>{isFollowing ? 'Unfollow' : 'Follow'}</ButtonText>
  </ButtonWrapper>
);

FollowButton.propTypes = {
  isFollowing: PropTypes.bool,
  onPress: PropTypes.func,
};

const ButtonWrapper = styled(TouchableOpacity)`
  width: 90;
  height: 28;
  border-radius: 14;
  margin-left: auto;
  margin-top: 10;
  align-self: flex-start;
  background-color: ${props =>
    props.isFollowing
      ? path(['theme', 'primary', 'lightRed'])
      : path(['theme', 'primary', 'purple'])};
`;

const ButtonText = styled(Text)`
  font-weight: 900;
  font-size: 14;
  line-height: 28;
  text-align: center;
  color: ${path(['theme', 'primary', 'lightBlue'])};
`;
