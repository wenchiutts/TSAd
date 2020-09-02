import * as React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SettingsScreen = () => (
  <StyledView>
    <Text>Settingssss!</Text>
  </StyledView>
);

SettingsScreen.propTypes = {};

export default SettingsScreen;
