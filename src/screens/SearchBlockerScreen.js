import * as React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

import EmptyStatusView from 'components/EmptyStatusView';
import EmptyFoundView from 'components/EmptyFoundView';

const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SearchBlockerScreen = () => (
  <StyledView>
    <EmptyStatusView text="followers" />
    {/* <EmptyFoundView /> */}
  </StyledView>
);

SearchBlockerScreen.propTypes = {};

export default SearchBlockerScreen;
