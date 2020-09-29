// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';

export const InteractionIcon = styled(Image)`
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

export const InteractionWithValue = ({ iconSlot, value, style }) => (
  <InteractionWrapper style={style}>
    {iconSlot}
    <Value>{value}</Value>
  </InteractionWrapper>
);

InteractionWithValue.propTypes = {
  style: PropTypes.array,
  iconSlot: PropTypes.element,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
