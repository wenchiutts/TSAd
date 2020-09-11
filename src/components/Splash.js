// @format

import * as React from 'react';
import { View, Image } from 'react-native';
import styled from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const BackgroundImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const Splash = () => (
  <Container>
    <BackgroundImage source={require('assets/images/splash.png')} />
  </Container>
);

export default Splash;
