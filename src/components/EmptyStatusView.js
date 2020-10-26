import * as React from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';
import { Text, View, Image } from 'react-native';
import styled from 'styled-components/native';

const StyledView = styled(View)`
  width: 300;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const EmptyStatusView = ({ style, text }) => (
  <StyledView style={style}>
    <Image
      source={require('assets/images/emptydata.png')}
      style={{ height: 120, resizeMode: 'contain' }}
    />
    <StyledText>There is no {text} on your instagram</StyledText>
  </StyledView>
);

EmptyStatusView.propTypes = {
  text: PropTypes.string,
  style: PropTypes.array,
};

export default EmptyStatusView;

const StyledText = styled(Text)`
  color: ${path(['theme', 'errorText'])};
  font-size: 16;
  font-weight: 500;
  text-align: center;
`;
