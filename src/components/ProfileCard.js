// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Text, View, ImageBackground } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';
import { LinearGradient } from 'expo-linear-gradient';

import { Avatar } from 'components/AvatarImage';
import { isPremiumUserSelector } from 'modules/user/userSelector';
import i18n from 'i18n';

const selector = createStructuredSelector({
  isPremium: isPremiumUserSelector,
});

const ProfileCard = ({ posts, followers, following, profilePicture }) => {
  const { isPremium } = useSelector(selector);
  return (
    <StyledView>
      <BackgroundWrapper />
      <StyledAvatar profilePicture={profilePicture} isPremium={isPremium} />
      <ContentWrapper>
        <View>
          <Value>{posts}</Value>
          <StyledText>{i18n.t('profile_posts')}</StyledText>
        </View>
        <View>
          <Value>{followers}</Value>
          <StyledText>{i18n.t('profile_followers')}</StyledText>
        </View>
        <View>
          <Value>{following}</Value>
          <StyledText>{i18n.t('profile_following')}</StyledText>
        </View>
      </ContentWrapper>
    </StyledView>
  );
};

ProfileCard.propTypes = {
  posts: PropTypes.number,
  followers: PropTypes.number,
  following: PropTypes.number,
  profilePicture: PropTypes.string,
};

export default ProfileCard;

const StyledView = styled(View)`
  height: 148;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
`;

const StyledAvatar = ({ profilePicture, isPremium }) => (
  <View>
    <Avatar source={{ uri: profilePicture }} />
    {isPremium && (
      <Tag>
        <TagText>{i18n.t('profile_PRO')}</TagText>
      </Tag>
    )}
  </View>
);

StyledAvatar.propTypes = {
  profilePicture: PropTypes.string,
  isPremium: PropTypes.bool,
};

const Tag = styled(View)`
  width: 44;
  height: 16;
  position: absolute;
  top: 53;
  left: 11;
  border-radius: 8;
  background-color: ${path(['theme', 'primary', 'lightBlue'])};
`;

const TagText = styled(Text)`
  line-height: 16;
  font-size: 12;
  text-align: center;
  font-weight: 500;
  color: ${path(['theme', 'primary', 'flatBlue'])};
`;

const BackgroundWrapper = () => (
  <GradientWrapper>
    <StyledImageBackground />
    <StyledLinearGradient
      colors={['transparent', 'rgba(182,32,224, 0.8)']}
      locations={[0.1, 1]}
      start={[0.5, 0.2]}
      end={[0, 0]}
    />
    <StyledLinearGradient
      colors={['transparent', 'rgba(182,32,224, 0.8)']}
      locations={[0.1, 1]}
      start={[0.6, 0.2]}
      end={[0, 1]}
    />
    <StyledLinearGradient
      colors={['transparent', 'rgba(182,32,224, 0.5)']}
      locations={[0.1, 1]}
      start={[0.4, 0.2]}
      end={[1, 0]}
    />
    <StyledLinearGradient
      colors={['transparent', 'rgba(182,32,224, 0.5)']}
      locations={[0.1, 1]}
      start={[0.6, 0.2]}
      end={[1, 1]}
    />
    <StyledLinearGradient
      colors={['transparent', 'rgba(182,32,224, 0.4)']}
      locations={[0.1, 1]}
      start={[0.6, 0.2]}
      end={[0.5, 1]}
    />
    <StyledLinearGradient
      colors={['transparent', 'rgba(182,32,224, 0.4)']}
      locations={[0.1, 1]}
      start={[0.6, 0.2]}
      end={[0.5, 0]}
    />
  </GradientWrapper>
);

const GradientWrapper = styled(View)`
  width: 100%;
  height: 148;
  position: absolute;
  left: 0;
`;

const StyledLinearGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12;
`;

const StyledImageBackground = styled(ImageBackground)`
  background-color: #32c5ff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12;
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
  font-size: 16;
  font-weight: bold;
`;
