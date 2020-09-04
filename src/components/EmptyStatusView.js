import * as React from 'react';
import { path } from 'ramda';
import { Text, View, Image } from 'react-native';
import styled from 'styled-components/native';

const EmptyStatusView = ({ text }) => {
  return (
    <View style={{ width: 300 }}>
      <Image source={require('assets/images/emptydata.png')} style={{ height: 120 }} />
      <StyledText>There is no {text} on your instagram</StyledText>
    </View>
  );
};

export default EmptyStatusView;

const StyledText = styled(Text)`
  color: ${path(['theme', 'errorText'])};
  font-size: 16;
  font-weight: 500;
  text-align: center;
`;
