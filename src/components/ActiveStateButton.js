import * as React from 'react';
import { Text, TouchableHighlight, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

const { width: screenWidth } = Dimensions.get('window');

const ActiveStateButton = ({ style, text, isActive, onPress }) => (
  <StyledButton style={style} isActive={isActive} onPress={onPress}>
    <StyledText isActive={isActive}>{text}</StyledText>
  </StyledButton>
);

export default ActiveStateButton;

const StyledButton = styled(TouchableHighlight)`
  background-color: ${props =>
    props.isActive ? path(['theme', 'buttonActiveBackground']) : path(['theme', 'listItemBg'])};
  height: 28;
  border-radius: 14;
  width: ${(screenWidth - 50) / 2};
`;

const StyledText = styled(Text)`
  color: ${path(['theme', 'noticeText'])};
  font-size: 16;
  line-height: 28;
  text-align: center;
  font-weight: ${props => (props.isActive ? 'bold' : 'normal')};
`;
