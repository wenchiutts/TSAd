// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { path, cond, pathEq } from 'ramda';

export const PLAN_TYPE = {
  MONTH: 'MONTH',
  HALF_YEAR: 'HALF_YEAR',
  YEAR: 'YEAR',
};

const PLAN_TYPE_ICON_MAP = {
  [PLAN_TYPE.MONTH]: require('assets/icons/pro_plan1.png'),
  [PLAN_TYPE.HALF_YEAR]: require('assets/icons/pro_plan1.png'),
  [PLAN_TYPE.YEAR]: require('assets/icons/pro_plan1.png'),
};

const PLAN_TYPE_NAME_MAP = {
  [PLAN_TYPE.MONTH]: '1 month',
  [PLAN_TYPE.HALF_YEAR]: '6 month',
  [PLAN_TYPE.YEAR]: '1 Year',
};

const Container = styled(TouchableOpacity)`
  background-color: ${cond([
    [pathEq(['type'], PLAN_TYPE.YEAR), path(['theme', 'primary', 'lightPink'])],
    [pathEq(['type'], PLAN_TYPE.HALF_YEAR), path(['theme', 'primary', 'pink'])],
    [pathEq(['type'], PLAN_TYPE.MONTH), path(['theme', 'primary', 'blue'])],
  ])};
  padding-vertical: 19;
  padding-right: 32;
  padding-left: 20;
  border-radius: 12;
  display: flex;
  flex-direction: row;
`;

const Icon = styled(Image)`
  width: 36;
  height: 36;
  resize-mode: contain;
  margin-right: 20;
  align-self: center;
`;

const StyledText = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
`;

const PlanName = styled(StyledText)`
  font-size: 14;
  font-weight: 900;
  letter-spacing: -0.68px;
  line-height: 17;
  margin-top: 5;
`;

const PriceWrapper = styled(View)`
  margin-left: auto;
`;

const Price = styled(StyledText)`
  font-size: 21;
  font-weight: 900;
  letter-spacing: -1.01px;
  line-height: 25;
`;

const AvgPrice = styled(StyledText)`
  font-size: 12;
  letter-spacing: -0.58px;
  line-height: 18.5;
  text-align: right;
`;

const ProductItem = ({ style, planType, price = '$29.99', avgPrice = '$2.49' }) => (
  <Container style={style} type={planType}>
    <Icon source={PLAN_TYPE_ICON_MAP[planType]} />
    <PlanName>{PLAN_TYPE_NAME_MAP[planType]}</PlanName>
    <PriceWrapper>
      <Price>{price}</Price>
      <AvgPrice>{avgPrice}/mo</AvgPrice>
    </PriceWrapper>
  </Container>
);

ProductItem.propTypes = {
  planType: PropTypes.string,
  price: PropTypes.string,
  avgPrice: PropTypes.string,
  style: PropTypes.array,
};

export default ProductItem;
