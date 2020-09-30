// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View, Image } from 'react-native';
import { ifElse, path, always, both, cond, T, F } from 'ramda';

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
  source: PropTypes.object,
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
  background-color: ${ifElse(path(['isExistStory']), always('pink'), always('transparent'))};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Avatar = ({ source, isFollower, isFollowing, isExistStory, roundedWidth = 60 }) => (
  <AvatarWrapper roundedWidth={roundedWidth + 6} isExistStory={isExistStory}>
    <AvatarImage source={source} roundedWidth={roundedWidth} />
    <FollowingStatusImage isFollower={isFollower} isFollowing={isFollowing} />
  </AvatarWrapper>
);

Avatar.propTypes = {
  source: PropTypes.object,
  isFollower: PropTypes.bool,
  isFollowing: PropTypes.bool,
  isExistStory: PropTypes.bool,
  roundedWidth: PropTypes.number,
};

export { Avatar, AvatarImage };
