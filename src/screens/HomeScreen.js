import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Button } from 'react-native';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components/native';

import ProfileCard from 'components/ProfileCard.js';
import {
  insFollowerCountSelector,
  insFollowingCountSelector,
  insPostCountSelector,
} from 'modules/instagram/selector';

const StyledView = styled(View)`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding-horizontal: 20;
  padding-top: 25%;
`;

// const userData = {
//   posts: 66666,
//   followers: 8888,
//   following: 99999,
// };

const userDataSelector = createStructuredSelector({
  followers: insFollowerCountSelector,
  following: insFollowingCountSelector,
  posts: insPostCountSelector,
});

const HomeScreen = ({ navigation }) => {
  const userData = useSelector(userDataSelector);
  return (
    <StyledView>
      <ProfileCard userData={userData} />
      <Button onPress={() => navigation.navigate('story')} title="Open story Modal" />
      <Button onPress={() => navigation.navigate('SearchBlocker')} title="Open search blocker" />
      <Button onPress={() => navigation.navigate('purchase')} title="Open purchase Modal" />
      <Button onPress={() => navigation.navigate('search')} title="Open search Modal" />
    </StyledView>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.object,
};

export default HomeScreen;
