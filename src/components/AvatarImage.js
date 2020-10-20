// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View, Image, ImageBackground } from 'react-native';
import { ifElse, path, always, both, cond, T, F } from 'ramda';
import { LinearGradient } from 'expo-linear-gradient';

const avatarStyle = ({ roundedWidth = 45 }) => `
  border-radius: ${roundedWidth / 2};
  width: ${roundedWidth};
  height: ${roundedWidth};
`;

const StyledImage = styled(Image)`
  ${avatarStyle}
`;

const AvatarImage = ({
  source = {
    uri:
      'https://www.nj.com/resizer/h8MrN0-Nw5dB5FOmMVGMmfVKFJo=/450x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SJGKVE5UNVESVCW7BBOHKQCZVE.jpg',
  },
  ...rest
}) => <StyledImage source={source} {...rest} />;

AvatarImage.propTypes = {
  source: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

const FollowingStatusIcon = styled(Image)`
  width: 24;
  height: 24;
  position: absolute;
  bottom: 4;
  right: 0;
`;

const FollowingStatusImage = cond([
  [
    both(path(['isFollower']), path(['isFollowing'])),
    always(<FollowingStatusIcon source={require('assets/icons/followstatus_mutual_small.png')} />),
  ],
  [
    path(['isFollower']),
    always(
      <FollowingStatusIcon
        source={require('assets/icons/followstatus_idontfollowback_small.png')}
      />,
    ),
  ],
  [
    path(['isFollowing']),
    always(
      <FollowingStatusIcon source={require('assets/icons/followstatus_followmeback_small.png')} />,
    ),
  ],
  [T, F],
]);

const AvatarWrapper = styled(View)`
  ${avatarStyle}
  background-color: transparent
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BackgroundWrapper = ({ roundedWidth, isExistStory }) => (
  <GradientWrapper>
    <StyledImageBackground roundedWidth={roundedWidth} />
    <StyledLinearGradient
      // roundedWidth={roundedWidth}
      colors={['transparent', 'rgba(182,32,224, 1)']}
      locations={[0.1, 1]}
      start={[1, 0]}
      end={[0.5, 0.5]}
    />
    <StyledLinearGradient
      // roundedWidth={roundedWidth}
      colors={['transparent', 'rgba(255,222,67, 1)']}
      locations={[0.1, 0.8]}
      start={[0.6, 0.4]}
      end={[0, 1]}
    />
  </GradientWrapper>
);

const GradientWrapper = styled(View)`
  position: absolute;
`;

const StyledLinearGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: ${props => (props.roundedWidth ? props.roundedWidth / 2 : 33)};
`;

const StyledImageBackground = styled(ImageBackground)`
  ${avatarStyle}
  background-color: #32c5ff;
`;

const Avatar = ({ source, isFollower, isFollowing, isExistStory, roundedWidth = 60 }) => (
  <AvatarWrapper roundedWidth={roundedWidth + 6}>
    {isExistStory && (
      <BackgroundWrapper roundedWidth={roundedWidth + 6} isExistStory={isExistStory} />
    )}
    <AvatarImage source={source} roundedWidth={roundedWidth} />
    <FollowingStatusImage isFollower={isFollower} isFollowing={isFollowing} />
  </AvatarWrapper>
);

Avatar.propTypes = {
  source: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  isFollower: PropTypes.bool,
  isFollowing: PropTypes.bool,
  isExistStory: PropTypes.bool,
  roundedWidth: PropTypes.number,
};

export { Avatar, AvatarImage };
