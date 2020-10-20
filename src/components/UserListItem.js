import * as React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import { compose, path, prop } from 'ramda';

import DEBUG from 'utils/logUtils';
import { Avatar } from 'components/AvatarImage';
import { followUserAction, unfollowUserAction } from 'modules/instagram/insAuthActions';
import { isExist, lookup } from 'utils/ramdaUtils';
import { followersDataSelector, followingsDataSelector } from 'modules/instagram/selector';
import i18n from 'i18n';

const selector = createStructuredSelector({
  followers: followersDataSelector,
  followings: followingsDataSelector,
});

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
  const { followers, followings } = useSelector(selector);
  const lookupFollowers = lookup(followers);
  const lookupFollowings = lookup(followings);
  const follow = () => dispatch(followUserAction(userId));
  const unfollow = username => {
    Alert.alert(i18n.t('user_list_item_button_unfollow'), `${i18n.t('general_unfollow_alert')}} @${username} ?`, [
      { text: i18n.t('general_no') },
      {
        text:  i18n.t('general_yes'),
        onPress: () => {
          dispatch(unfollowUserAction(userId));
        },
      },
    ]);
  };
  const localIsFollowing = isFollowing ?? compose(isExist, lookupFollowings)(userId);
  const localIsFollower = isFollower ?? compose(isExist, lookupFollowers)(userId);
  return (
    <Wrapper style={style}>
      <Avatar
        source={{ uri: profilePicture }}
        isFollower={localIsFollower}
        isFollowing={localIsFollowing}
        roundedWidth={roundedWidth}
        isExistStory={isExistStory}
      />
      <TextWrapper>
        <Username>@{username}</Username>
        {descriptionElement}
      </TextWrapper>
      {!buttonHide ? (
        <FollowButton
          isFollowing={localIsFollowing}
          onPress={localIsFollowing ? () => unfollow(username) : follow}
        />
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
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    <ButtonText>{isFollowing ? i18n.t('user_list_item_button_unfollow') : i18n.t('user_list_item_button_follow')}</ButtonText>
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
