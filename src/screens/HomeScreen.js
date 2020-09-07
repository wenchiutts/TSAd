import * as React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button, Dimensions } from 'react-native';
import styled from 'styled-components/native';

import ProfileCard from 'components/ProfileCard.js';

const { width: screenWidth } = Dimensions.get('window');

const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled(View)`
  width: ${screenWidth - 40};
  flex: 1;
  margin-top: 25%;
`;

const userData = {
  posts: 66666,
  followers: 8888,
  following: 99999,
};

const HomeScreen = ({ navigation }) => (
  <StyledView>
    <Wrapper>
      <ProfileCard userData={userData} />
      <Button onPress={() => navigation.navigate('story')} title="Open story Modal" />
      <Button onPress={() => navigation.navigate('SearchBlocker')} title="Open search blocker" />
      <Button onPress={() => navigation.navigate('purchase')} title="Open purchase Modal" />
      <Button onPress={() => navigation.navigate('search')} title="Open search Modal" />
    </Wrapper>
  </StyledView>
);

HomeScreen.propTypes = {
  navigation: PropTypes.object,
};

export default HomeScreen;
