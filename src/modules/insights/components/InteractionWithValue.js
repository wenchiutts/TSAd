// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';
import FastImage from 'react-native-fast-image';

export const InteractionIcon = styled(FastImage)`
  width: 20;
  height: 20;
`;

const InteractionWrapper = styled(View)`
  height: 18;
  flex-direction: row;
  align-items: center;
`;

const Value = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
  margin-left: 8;
`;

export const InteractionWithValue = React.memo(({ iconSlot, value, style }) => (
  <InteractionWrapper style={style}>
    {iconSlot}
    <Value>{value}</Value>
  </InteractionWrapper>
));

InteractionWithValue.propTypes = {
  style: PropTypes.array,
  iconSlot: PropTypes.element,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
