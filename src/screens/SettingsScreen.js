import * as React from 'react';
import { Text, View, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

import PromotionCard from 'components/PromotionCard.js';

const { width: screenWidth } = Dimensions.get('window');

const StyledView = styled(View)`
  flex: 1;
  justify-content: flex-start;
  padding-horizontal: 20;
  padding-top: 25%;
  background-color: ${path(['theme', 'screenBackground'])};
`;

const SettingsScreen = () => (
  <StyledView>
    <PromotionCard />
  </StyledView>
);

SettingsScreen.propTypes = {};

export default SettingsScreen;
