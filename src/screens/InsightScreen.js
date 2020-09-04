// @format
import * as React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${path(['theme', 'screenBackground'])};
`;

const InsightScreen = () => (
  <StyledView>
    <Text>Insight!</Text>
  </StyledView>
);

InsightScreen.propTypes = {};

export default InsightScreen;
