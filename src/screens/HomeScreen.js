import * as React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Button, Dimensions } from 'react-native';
import styled from 'styled-components/native';

import ProfileCard from 'components/ProfileCard.js';

const { width: screenWidth } = Dimensions.get('window');

const StyledView = styled(View)`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding-horizontal: 20;
  padding-top: 25%;
`;

const userData = {
  posts: 66666,
  followers: 8888,
  following: 99999,
};

const HomeScreen = ({ navigation }) => (
  <StyledView>
    <ProfileCard userData={userData} />
    <Button onPress={() => navigation.navigate('story')} title="Open story Modal" />
    <Button onPress={() => navigation.navigate('SearchBlocker')} title="Open search blocker" />
    <Button onPress={() => navigation.navigate('purchase')} title="Open purchase Modal" />
    <Button onPress={() => navigation.navigate('search')} title="Open search Modal" />
    <Button onPress={() => navigation.navigate('NewFollowers')} title="New Followers" />
    <Button onPress={() => navigation.navigate('Unfollowers')} title="Unfollowers" />
    <Button
      onPress={() => navigation.navigate('NotFollowingMeBack')}
      title="Not Following Me Back"
    />
    <Button
      onPress={() => navigation.navigate('ImNotFollowingBack')}
      title={`I'm Not Following Back`}
    />
    <Button onPress={() => navigation.navigate('MutualFollowing')} title="Mutual Following" />
    <Button onPress={() => navigation.navigate('BestFollowers')} title="Best Followers" />
    <Button onPress={() => navigation.navigate('GhostFollowers')} title="Ghost Followers" />
    <Button onPress={() => navigation.navigate('ViewMyProfile')} title="Who Viewed My Profile" />
  </StyledView>
);

HomeScreen.propTypes = {
  navigation: PropTypes.object,
};

export default HomeScreen;
