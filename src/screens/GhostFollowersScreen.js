import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import styled from 'styled-components/native';

import UserListItem from 'components/UserListItem';

const GhostFollowersScreen = () => (
  <View>
    <Text>ghost</Text>
  </View>
);

export default GhostFollowersScreen;

const StyledView = styled(ScrollView).attrs({
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '22%',
    paddingHorizontal: 20,
  },
})`
  flex: 1;
`;
