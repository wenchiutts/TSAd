import * as React from 'react';
import { path } from 'ramda';
import { Text, View, Image } from 'react-native';
import styled from 'styled-components/native';

const SearchingGuideView = () => {
  return (
    <StyledView>
      <Image
        source={require('assets/images/arrow.png')}
        style={{ position: 'absolute', top: 20, left: -90, height: 128, resizeMode: 'contain' }}
      />
      <Image
        source={require('assets/images/search.png')}
        style={{ height: 120, resizeMode: 'contain' }}
      />
      <StyledText>Search by inputing username</StyledText>
    </StyledView>
  );
};

export default SearchingGuideView;

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
