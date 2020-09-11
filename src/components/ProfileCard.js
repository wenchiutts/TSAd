// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { Text, View, ImageBackground } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

import { Avatar } from 'components/AvatarImage';

const ProfileCard = ({ posts, followers, following, profilePicture }) => (
  <View>
    <StyledImageBackground>
      <Avatar source={{ uri: profilePicture }} />
      <ContentWrapper>
        <View>
          <Value>{posts}</Value>
          <StyledText>posts</StyledText>
        </View>
        <View>
          <Value>{followers}</Value>
          <StyledText>followers</StyledText>
        </View>
        <View>
          <Value>{following}</Value>
          <StyledText>following</StyledText>
        </View>
      </ContentWrapper>
    </StyledImageBackground>
  </View>
);

ProfileCard.propTypes = {
  posts: PropTypes.number,
  followers: PropTypes.number,
  following: PropTypes.number,
  profilePicture: PropTypes.string,
};

export default ProfileCard;

const StyledImageBackground = styled(ImageBackground)`
  width: 100%;
  height: 148;
  background-color: #b620e0;
  border-radius: 12;
  flex-direction: row
  justify-content: space-around;
  align-items: center;
  padding-horizontal: 16;
`;

const ContentWrapper = styled(View)`
  width: 200;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledText = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  text-align: center;
  font-size: 14;
`;

const Value = styled(StyledText)`
font-size:16
  font-weight: bold;
`;
