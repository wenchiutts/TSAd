// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Image, TouchableHighlight } from 'react-native';
import styled from 'styled-components/native';
import ImageSlider from 'react-native-image-slider';
import { ifElse, path, always } from 'ramda';

import Colors from 'constants/Colors';
import CancelButton from 'components/header/CancelButton';
import ProductItem, { PLAN_TYPE } from 'components/ProductItem';

const StyledView = styled(ScrollView).attrs({
  contentContainerStyle: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 90,
  },
})`
  flex: 1;
`;

const ImageSliderWrapper = styled(View)`
  flex: none;
  height: 448;
`;

const ImageWrapper = styled(View)`
  display: flex;
`;

const StyledImage = styled(Image)`
  flex: 1 0 100%;
  width: 100%;
  resize-mode: contain;
`;

const ButtonWrapper = styled(View)`
  position: absolute;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  bottom: 75;
  right: 0;
  left: 0;
  margin-horizontal: auto;
`;

const Button = styled(TouchableHighlight)`
  margin-vertical: 3;
  margin-horizontal: 3;
  width: ${ifElse(path(['selected']), always(20), always(14))};
  height: ${ifElse(path(['selected']), always(20), always(14))};
  border-radius: ${ifElse(path(['selected']), always(10), always(7))};
  background-color: ${ifElse(path(['selected']), always('#6236FF'), always('#6952BE'))};
  opacity: ${ifElse(path(['selected']), always(1), always(0.9))};
`;

const ProductListWrapper = styled(View)`
  background-color: ${path(['theme', 'screenBackground'])};
  border-top-right-radius: 24;
  border-top-left-radius: 24;
  flex: 1;
  width: 100%;
  margin-top: -45;
  padding-top: 40;
  padding-horizontal: 20;
`;

const StyledProductItem = styled(ProductItem)`
  margin-top: 16;
`;

const images = [
  require('assets/images/pro_instro1.png'),
  require('assets/images/pro_instro2.png'),
  require('assets/images/pro_instro3.png'),
  require('assets/images/pro_instro4.png'),
];

const PurchaseModal = ({ navigation }) => {
  navigation.setOptions({
    cardStyle: {
      backgroundColor: Colors.screenBackground,
    },
    title: '',
    headerLeft: () => <CancelButton />,
  });
  return (
    <StyledView>
      <ImageSliderWrapper>
        <ImageSlider
          images={images}
          customSlide={({ index, item, style, width }) => (
            // It's important to put style here because it's got offset inside
            <ImageWrapper key={index} style={style} index={index}>
              <StyledImage source={item} />
            </ImageWrapper>
          )}
          customButtons={(position, move) => (
            <ButtonWrapper>
              {images.map((image, index) => (
                <Button key={index} onPress={() => move(index)} selected={position === index}>
                  <View />
                </Button>
              ))}
            </ButtonWrapper>
          )}
        />
      </ImageSliderWrapper>
      <ProductListWrapper>
        <ProductItem planType={PLAN_TYPE.YEAR} />
        <StyledProductItem planType={PLAN_TYPE.HALF_YEAR} />
        <StyledProductItem planType={PLAN_TYPE.MONTH} />
      </ProductListWrapper>
    </StyledView>
  );
};

PurchaseModal.propTypes = {
  navigation: PropTypes.object,
};

export default PurchaseModal;
