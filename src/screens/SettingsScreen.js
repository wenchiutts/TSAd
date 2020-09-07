import * as React from 'react';
import { Text, View, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

import PromotionCard from 'components/PromotionCard.js';

const { width: screenWidth } = Dimensions.get('window');

const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${path(['theme', 'screenBackground'])};
`;

const Wrapper = styled(View)`
  width: ${screenWidth - 40};
  flex: 1;
  margin-top: 25%;
`;

const SettingsScreen = () => (
  <StyledView>
    <Wrapper>
      <PromotionCard></PromotionCard>
    </Wrapper>
  </StyledView>
);

SettingsScreen.propTypes = {};

export default SettingsScreen;
