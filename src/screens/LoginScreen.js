// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, TouchableHighlight, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CookieManager from '@react-native-community/cookies';
import { ifElse, path, always } from 'ramda';
import ImageSlider from 'react-native-image-slider';

import Colors from 'constants/Colors';
import i18n from 'i18n';

const images = [
  {
    uri: require('assets/images/onboarding_01.png'),
    text: i18n.t('login_slogan_1'),
  },
  {
    uri: require('assets/images/onboarding_02.png'),
    text: i18n.t('login_slogan_2'),
  },
  {
    uri: require('assets/images/onboarding_03.png'),
    text: i18n.t('login_slogan_3'),
  },
  {
    uri: require('assets/images/onboarding_04.png'),
    text: i18n.t('login_slogan_4'),
  },
]

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    CookieManager.clearAll(true).then(success => {
      console.log('CookieManager.clearAll =>', success);
    });
  }, []);

  const onPressLogin = React.useCallback(() => {
    navigation.navigate('InsLogin');
  }, []);

  return (
    <Container>
      {isLoading && <StyledActivityIndicator size="large" color={Colors.primary.lightGray} />}
      <ImageSliderWrapper>
        <ImageSlider
          loop
          loopBothSides
          autoPlayWithInterval={1500}
          images={images}
          customSlide={({ index, item, style, width }) => (
            // It's important to put style here because it's got offset inside
            <ImageWrapper key={index} style={style} index={index}>
              <StyledImage source={item.uri} />
              <StyledText>{item.text}</StyledText>
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
      <View style={{
        flex: 1,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
      }}>
        <LoginButton onPress={onPressLogin} />
        <WarningMessage><Ionicons name="md-lock" size={24} color="white" /> {i18n.t('general_data_usage')}</WarningMessage>
      </View>
    </Container>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.object,
};

export default LoginScreen;

const StyledText = styled(Text)`
color: ${path(['theme', 'primary', 'lightBlue'])};
font-size: 20;
font-weight: bold;
text-align: center;
padding-top: 25;
background-color: ${path(['theme', 'screenBackground'])};
`

const ImageSliderWrapper = styled(View)`
  flex: 1;
  height: 440;
`;

const ImageWrapper = styled(View)`
  display: flex;
`;

const StyledImage = styled(Image)`
  flex: 1;
  width: 100%;
  resize-mode: cover;
`;

const ButtonWrapper = styled(View)`
  position: absolute;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  bottom: -50;
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

const Container = styled(View)`
  width: ${screenWidth};
  height: ${screenHeight};
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: ${path(['theme', 'screenBackground'])};
`;

const StyledActivityIndicator = styled(ActivityIndicator)`
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
`;

const BackgroundImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const GradientLayer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
`;

const LoginButtonWrapper = styled(TouchableOpacity)`
  width: 75%;
  max-width: 400;
  height: 60;
  border-radius: 12;
  background-color: #32c5ff;
  margin-top: 25%;
`;

const LoginButton = ({ onPress }) => (
  <LoginButtonWrapper onPress={onPress}>
    <StyledLinearGradient
      colors={['transparent', '#B620E0']}
      locations={[0.1, 1]}
      start={[0.7, 0.4]}
      end={[0, 1]}
    >
      <StyledLinearGradient
        colors={['transparent', 'rgba(182,32,224, 0.7)']}
        locations={[0.1, 1]}
        start={[0.5, 0.4]}
        end={[1, 1]}
      >
        <Image
          source={require('assets/icons/instagramlogo.png')}
          style={{ width: 28, height: 28, marginRight: 12 }}
        />
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {i18n.t('general_login')}
        </Text>
      </StyledLinearGradient>
    </StyledLinearGradient>
  </LoginButtonWrapper>
);

LoginButton.propTypes = {
  onPress: PropTypes.func,
};

const LoginLogo = styled(Image)`
  width: 65%;
  max-width: 260;
  max-height: 270;
`;

const StyledLinearGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 12;
`;

const WarningMessage = styled(Text)`
  color: #FFFFFF;
  max-width: 80%;
  margin-top: 20;
`;
