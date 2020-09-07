import * as React from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

import { Avatar } from 'components/AvatarImage';

const ProfileCard = ({ userData: { posts, followers, following } }) => {
  return (
    <View>
      <StyledImageBackground>
        <Avatar />
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
