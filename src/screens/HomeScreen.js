import * as React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button } from 'react-native';
import styled from 'styled-components/native';

const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const HomeScreen = ({ navigation }) => (
  <StyledView>
    <Text>Home!</Text>
    <Button onPress={() => navigation.navigate('story')} title="Open story Modal" />
    <Button onPress={() => navigation.navigate('SearchBlocker')} title="Open search blocker" />
    <Button onPress={() => navigation.navigate('purchase')} title="Open purchase Modal" />
    <Button onPress={() => navigation.navigate('search')} title="Open search Modal" />
  </StyledView>
);

HomeScreen.propTypes = {
  navigation: PropTypes.object,
};

export default HomeScreen;
