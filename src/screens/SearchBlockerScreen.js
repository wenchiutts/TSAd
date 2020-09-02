import * as React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SearchBlockerScreen = () => (
  <StyledView>
    <Text>Search Block</Text>
  </StyledView>
);

SearchBlockerScreen.propTypes = {};

export default SearchBlockerScreen;
