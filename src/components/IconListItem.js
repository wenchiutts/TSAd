// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text, Image, TouchableOpacity } from 'react-native';
import { path } from 'ramda';
import { isExist } from 'utils/ramdaUtils';

const Wrapper = styled(TouchableOpacity)`
  border-radius: 12;
  background-color: ${path(['theme', 'listItemBg'])};
  padding-left: 20;
  padding-right: 32;
  padding-vertical: 18;
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const Description = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
  font-weight: 500;
  letter-spacing: -0.68;
  line-height: 17;
`;

const Value = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 16;
  font-weight: 900;
  letter-spacing: -0.77px;
  line-height: 19;
  text-align: right;
  margin-left: auto;
`;

const Icon = styled(Image)`
  width: 32;
  height: 32;
  margin-right: 20;
`;

const IconListItem = ({ style, iconSource, description, value, onPress }) => (
  <Wrapper style={style} onPress={onPress}>
    {isExist(iconSource) && <Icon source={iconSource} />}
    <Description>{description}</Description>
    {isExist(value) && <Value>{value}</Value>}
  </Wrapper>
);

IconListItem.propTypes = {
  style: PropTypes.array,
  iconSource: PropTypes.object,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPress: PropTypes.func,
};

export default IconListItem;
