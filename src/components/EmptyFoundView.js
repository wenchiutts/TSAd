import * as React from 'react';
import { path } from 'ramda';
import { Text, View, Image } from 'react-native';
import styled from 'styled-components/native';

const EmptyFoundView = ({ text }) => {
  return (
    <StyledView>
      <Image
        source={require('assets/images/notfound.png')}
        style={{ height: 120, resizeMode: 'contain' }}
      />
      <StyledText>Nothing found</StyledText>
    </StyledView>
  );
};

export default EmptyFoundView;

const StyledText = styled(Text)`
  color: ${path(['theme', 'errorText'])};
  font-size: 16;
  font-weight: 500;
  text-align: center;
`;

const StyledView = styled(View)`
  width: 300;
  justify-content: center;
  align-items: center;
  flex: 1;
`;
