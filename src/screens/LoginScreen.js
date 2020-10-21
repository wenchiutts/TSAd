// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
// import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CookieManager from '@react-native-community/cookies';
import Colors from 'constants/Colors';

import i18n from 'i18n';

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    CookieManager.clearAll(true)
      .then((success) => {
        console.log('CookieManager.clearAll =>', success);
      });
  }, []);

  const onPressLogin = React.useCallback(() => {
    navigation.navigate('InsLogin');
  }, []);

  return (
    <Container>
      {
        isLoading && <StyledActivityIndicator size="large" color={Colors.primary.lightGray} />
      }
      <BackgroundImage source={require('assets/splash.png')} />
      <LoginButton onPress={onPressLogin} />
      {/* <WarningMessage><Ionicons name="md-lock" size={24} color="white" /> {i18n.t('general_data_usage')}</WarningMessage> */}
      <Text style={{ color: '#FFFFFF' }}>Fuck you</Text>
    </Container>
  );
};

LoginScreen.propTypes = {
  navigation: PropTypes.object,
};

export default LoginScreen;

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
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
  margin-top: 70%;
`;

const LoginButton = ({ onPress }) => (
  <LoginButtonWrapper onPress={onPress}>
    <StyledLinearGradient
      colors={['transparent', '#B620E0']}
      locations={[0.1, 1]}
      start={[0.7, 0.4]}
      end={[0, 1]}>
      <StyledLinearGradient
        colors={['transparent', 'rgba(182,32,224, 0.7)']}
        locations={[0.1, 1]}
        start={[0.5, 0.4]}
        end={[1, 1]}>
        <Image
          source={require('assets/icons/instagramlogo.png')}
          style={{ width: 28, height: 28, marginRight: 12 }}
        />
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
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

// const WarningMessage = styled(Text)`
//   color: #FFFFFF;
//   max-width: 80%;
//   margin-top: 20;
// `;
