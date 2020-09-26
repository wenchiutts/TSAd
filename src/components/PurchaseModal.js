// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ScrollView, View, Image, TouchableHighlight, FlatList, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import ImageSlider from 'react-native-image-slider';
import _ from 'lodash';
import { ifElse, path, always } from 'ramda';
import * as InAppPurchases from 'expo-in-app-purchases';

import Colors from 'constants/Colors';
import CancelButton from 'components/header/CancelButton';
import ProductItemWithIAP, { PLAN_TYPE } from 'components/ProductItem';
import { PRODUCTS_IDS, PRODUCT_PLAN_TYPE_MAP } from 'constants/Products';
import { purchaseSubscriptionAction } from 'actions/userActions';

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

const ProductListWrapper = styled(SafeAreaView).attrs({
  flex: 1,
  backgroundColor: Colors.screenBackground,
  contentContainerStyle: {
    marginTop: -45,
  },
})`
  padding-top: 40;
  padding-horizontal: 20;
  width: 100%;
`;

const ProductListWrapperView = styled(View)`
  flex: 1;
  border-top-right-radius: 24;
  border-top-left-radius: 24;
`;

const StyledProductItemWithIAP = styled(ProductItemWithIAP)`
  margin-top: 16;
`;

const images = [
  require('assets/images/pro_instro1.png'),
  require('assets/images/pro_instro2.png'),
  require('assets/images/pro_instro3.png'),
  require('assets/images/pro_instro4.png'),
];

const initialListContents = Object.values(PRODUCTS_IDS);
console.log('initialListContents', initialListContents);

const PurchaseModal = ({ navigation }) => {
  const premium = useSelector(state => state?.user?.premium);
  const dispatch = useDispatch();
  const [listContents, setListContents] = React.useState(initialListContents);
  const [isLoading, setIsLoading] = React.useState(false);

  console.log('setListContents', setListContents);

  navigation.setOptions({
    cardStyle: {
      backgroundColor: Colors.screenBackground,
    },
    title: '',
    headerLeft: () => <CancelButton onPress={() => navigation.goBack()} />,
  });

  React.useEffect(() => {
    const initIap = async () => {
      try {
        // Init IAP
        const history = await InAppPurchases.connectAsync().catch(e =>
          console.log('initIap error: ', e),
        );
        const productIds = Object.values(PRODUCTS_IDS);
        const { responseCode, results: productResults } = await InAppPurchases.getProductsAsync(
          productIds,
        );
        setListContents(productResults);
        // const listContentsWithPrice = results.sort(
        //   (a, b) => a?.priceAmountMicros - b?.priceAmountMicros,
        // );

        // Add Purchase Listener
        InAppPurchases.setPurchaseListener(async ({ responseCode, results, errorCode }) => {
          if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            for (const purchase of results) {
              if (!purchase.acknowledged) {
                console.log(`Successfully purchased ${purchase.productId}`);
                await InAppPurchases.finishTransactionAsync(purchase, false);
              }
            }
            const purchases = results
              .filter(result => !result.acknowledged)
              .sort((a, b) => b.purchaseTime - a.purchaseTime);

            if (!_.isEmpty(purchases) && purchases[0]?.acknowledged === false) {
              const productInfo = productResults.find(
                content => content.productId === purchases[0]?.productId,
              );
              const productInfoWithPurchaseTime = {
                ...productInfo,
                purchaseTime: purchases[0]?.purchaseTime,
              };
              console.log('purchaseSubscriptionAction productInfo', productInfoWithPurchaseTime);
              dispatch(purchaseSubscriptionAction(productInfoWithPurchaseTime));
            }
          } else {
            if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
              const errorMessage = 'User canceled the transaction';
              console.log(errorMessage);
              // dispatch(purchaseErrorAction({ errorMessage }));
            } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
              const errorMessage =
                'User does not have permissions to buy but requested parental approval (iOS only)';
              console.log(errorMessage);
              // dispatch(purchaseErrorAction({ errorMessage }));
            } else {
              const errorMessage = `Something went wrong with the purchase. Received errorCode ${errorCode}`;
              console.log(errorMessage);
              // dispatch(purchaseErrorAction({ errorMessage }));
            }
          }
        });
      } catch (e) {
        console.log('initIap error:', e);
      }
    };
    initIap();
  }, []);

  React.useEffect(() => {
    // if (premium.status === 'active') {
    //   console.log(premium);
    //   navigation.navigate('Home');
    // }
    console.log(premium);
  }, [premium.status]);

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
        <ProductListWrapperView>
          <FlatList
            data={listContents}
            renderItem={({ item }) => {
              return (
                <StyledProductItemWithIAP
                  key={item.productId}
                  productId={item.productId}
                  price={item.price}
                  planType={PRODUCT_PLAN_TYPE_MAP[item.description]}
                  setIsLoading={setIsLoading}
                />
              );
            }}
          />
        </ProductListWrapperView>
      </ProductListWrapper>
    </StyledView>
  );
};

PurchaseModal.propTypes = {
  navigation: PropTypes.object,
};

export default PurchaseModal;
