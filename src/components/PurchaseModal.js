// @format
import * as React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const PurchaseModal = () => (
  <StyledView>
    <Text>Purchase Modal!</Text>
  </StyledView>
);

export default PurchaseModal;
