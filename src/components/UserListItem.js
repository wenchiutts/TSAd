import * as React from 'react';
import { Text, View, TouchableOpacity, Button, Image } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

import { Avatar } from 'components/AvatarImage';

const UserListItem = ({
  username,
  isFollower,
  isFollowing,
  time,
  descriptionHide,
  descriptionText,
  buttonHide,
  iconType,
  value,
}) => {
  const FollowButton = ({ isFollowing }) => (
    <ButtonWrapper isFollowing={isFollowing}>
      <ButtonText>{isFollowing ? 'Unfollow' : 'Follow'}</ButtonText>
    </ButtonWrapper>
  );

  const DescriptionElement = ({ iconType, value }) => {
    if (!descriptionHide) {
      if (buttonHide) {
        return <DescriptionWrapper iconType={iconType} value={value} />;
      }
      return (
        <Description>
          {descriptionText}: {time}
        </Description>
      );
    } else {
      return <Description></Description>;
    }
  };

  return (
    <Wrapper>
      <Avatar isFollower={isFollower} isFollowing={isFollowing} />
      <TextWrapper>
        <Username>@{username}</Username>
        <DescriptionElement iconType={iconType} value={value} />
      </TextWrapper>
      {!buttonHide ? <FollowButton isFollowing={isFollowing} /> : <></>}
    </Wrapper>
  );
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

const Description = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
`;

const StyledImage = styled(Image)`
  width: 20;
  height: 20;
  margin-right: 8;
`;

const DescriptionWrapper = ({ iconType, value }) => (
  <View style={{ height: 18, flexDirection: 'row' }}>
    {iconType === 'like' && <StyledImage source={require('assets/icons/like_small.png')} />}
    {iconType === 'comment' && <StyledImage source={require('assets/icons/comment_small.png')} />}
    <Description>{value}</Description>
  </View>
);

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
