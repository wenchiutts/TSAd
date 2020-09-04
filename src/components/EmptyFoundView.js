import * as React from 'react';
import { path } from 'ramda';
import { Text, View, Image } from 'react-native';
import styled from 'styled-components/native';

const EmptyFoundView = ({ text }) => {
  return (
    <View style={{ width: 300 }}>
      <Image source={require('assets/images/notfound.png')} style={{ height: 120 }} />
      <StyledText>Nothing found</StyledText>
    </View>
  );
};

export default EmptyFoundView;

const StyledText = styled(Text)`
  color: ${path(['theme', 'errorText'])};
  font-size: 16;
  font-weight: 500;
  text-align: center;
`;
