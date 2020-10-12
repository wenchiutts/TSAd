// @format
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { path, cond, equals, T, always } from 'ramda';
import { purchaseItemAsync } from 'expo-in-app-purchases';
import { LinearGradient } from 'expo-linear-gradient';

export const PLAN_TYPE = {
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  // HALF_YEAR: 'HALF_YEAR',
  YEAR: 'YEAR',
};

const PLAN_TYPE_ICON_MAP = {
  [PLAN_TYPE.WEEK]: require('assets/icons/pro_plan3.png'),
  [PLAN_TYPE.MONTH]: require('assets/icons/pro_plan2.png'),
  // [PLAN_TYPE.HALF_YEAR]: require('assets/icons/pro_plan1.png'),
  [PLAN_TYPE.YEAR]: require('assets/icons/pro_plan1.png'),
};

const PLAN_TYPE_NAME_MAP = {
  [PLAN_TYPE.WEEK]: '1 week',
  [PLAN_TYPE.MONTH]: '1 month',
  // [PLAN_TYPE.HALF_YEAR]: '6 month',
  [PLAN_TYPE.YEAR]: '1 Year',
};

const Container = styled(TouchableOpacity)`
  overflow: hidden;
  position: relative;
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

const StyledLinearGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ProductItem = ({ style, planType, price = '$29.99', avgPrice = '$2.49', onPress }) => (
  <Container style={style} type={planType} onPress={onPress}>
    <StyledLinearGradient
      colors={cond([
        [equals(PLAN_TYPE.YEAR), always(['#FEA15A', '#FC5C7B'])],
        [equals(PLAN_TYPE.MONTH), always(['#44D7B6', '#32C5FF'])],
        [equals(PLAN_TYPE.WEEK), always(['#32C5FF', '#0091FF'])],
        [T, always(['#FEA15A', '#FC5C7B'])],
      ])(planType)}
      locations={[0, 1]}
      start={[0, 1]}
      end={[1, 0]}
    />
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
  onPress: PropTypes.func,
};

const ProductItemWithIAP = props => {
  const onPress = async () => {
    console.log('ProductItemWithIAP productId', props?.productId);
    props.setIsLoading(true);
    // TODO: Victor if the content productId would changed in list item,
    // should put the content as dependency
    const res = await purchaseItemAsync(props?.productId);
    props.setIsLoading(false);
  };
  // const onPress = useCallback(async () => {
  //   props.setIsLoading(true);
  //   // TODO: Victor if the content productId would changed in list item,
  //   // should put the content as dependency
  //   const res = await purchaseItemAsync(props?.content?.productId);
  //   props.setIsLoading(false);
  // }, []);
  return <ProductItem {...props} onPress={onPress} />;
};

ProductItemWithIAP.propTypes = {
  setIsLoading: PropTypes.func,
};

export default ProductItemWithIAP;
