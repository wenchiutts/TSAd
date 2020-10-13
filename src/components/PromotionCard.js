import * as React from 'react';
import { Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { path } from 'ramda';
import { useSelector } from 'react-redux';

import i18n from 'i18n';

const PromotionCard = () => {
  const premium = useSelector(state => state?.user?.premium);
  const navigation = useNavigation();

  const onPress = () => {
    // premium.status === 'active' && navigation.navigate('purchase');
    navigation.navigate('purchase');
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        source={require('assets/images/upgrade.png')}
        style={{ width: '100%', height: 160 }}
        imageStyle={{ borderRadius: 12 }}>
        <ContentWrapper>
          <StyledText>{i18n.t('settings_promo_text_1')}</StyledText>
          <StyledStrongText>{i18n.t('settings_promo_text_2')}</StyledStrongText>
          <TryButton title="Try it now">
            <ButtonText>{i18n.t('settings_promo_button')}</ButtonText>
          </TryButton>
        </ContentWrapper>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default PromotionCard;

const ContentWrapper = styled(View)`
  margin-left: 32;
  margin-top: 50;
`;

const TryButton = styled(TouchableOpacity)`
  width: 64;
  height: 18;
  border-radius: 9;
  background-color: ${path(['theme', 'primary', 'flatBlue'])};
  padding-vertical: 4;
  margin-top: 12;
`;

const ButtonText = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 11;
  line-height: 11;
  margin: auto;
`;

const StyledText = styled(Text)`
  font-size: 20;
  color: ${path(['theme', 'primary', 'lightBlue'])};
`;

const StyledStrongText = styled(StyledText)`
  font-weight: bold;
`;
