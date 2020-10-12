// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import dayjs from 'dayjs';

import { Avatar } from 'components/AvatarImage';

const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const StyledView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const Username = styled(Text)`
  color: #f7f9ff;
  font-size: 14;
  font-weight: 500;
  letter-spacing: -0.34;
  line-height: 17;
`;

const RelativeTime = styled(Text)`
  color: #f7f9ff;
  font-size: 12;
  letter-spacing: -0.29;
  line-height: 18.5;
  margin-top: 2;
`;

const InfoWrapper = styled(View)`
  margin-left: 2;
`;

const StoryAvatar = ({ style, imgSrc, username, createTime }) => (
  <StyledView style={style}>
    <Avatar source={imgSrc} roundedWidth={44} />
    <InfoWrapper>
      <Username>@aaaa{username}</Username>
      <RelativeTime>{dayjs.unix(createTime).fromNow()}</RelativeTime>
    </InfoWrapper>
  </StyledView>
);

StoryAvatar.propTypes = {
  imgSrc: PropTypes.string,
  username: PropTypes.string,
  createTime: PropTypes.number,
  style: PropTypes.array,
};

export default StoryAvatar;
