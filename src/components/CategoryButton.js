import * as React from 'react';
import { View, Text, ScrollView, TouchableHighlight, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

const { width: screenWidth } = Dimensions.get('window');

const CategoryButton = ({ text, index, active, setActiveIndex }) => (
  <StyledButton
    active={active}
    onPress={() => {
      if (index === 0) {
        setActiveIndex(0);
      }
      if (index === 1) {
        setActiveIndex(1);
      }
    }}>
    <StyledText active={active}>{text}</StyledText>
  </StyledButton>
);

export default CategoryButton;

const StyledButton = styled(TouchableHighlight)`
  background-color: ${props =>
    props.active ? path(['theme', 'buttonActiveBackground']) : path(['theme', 'listItemBg'])};
  height: 28;
  border-radius: 14;
  width: ${(screenWidth - 50) / 2};
`;

const StyledText = styled(Text)`
  color: ${path(['theme', 'noticeText'])};
  font-size: 16;
  line-height: 28;
  text-align: center;
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
`;
