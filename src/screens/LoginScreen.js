// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import CookieManager from '@react-native-community/cookies';
import delay from 'delay';

import { isExist } from 'utils/ramdaUtils';
import {
  requestInsCookies,
  receiveInsCookies,
  fetchInsUserProfileAction,
} from 'modules/instagram/insAuthActions';
import { IgUserNameContext } from 'modules/instagram/useCheckUserLoginIg';

import {
  newLogin,
  //   receiveInsCookies,
  //   fetchInsUserProfileAction
} from 'actions/userActions';

const { height: initialHeight, width: initialWidth } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { setUserName } = React.useContext(IgUserNameContext);
  const dispatch = useDispatch();
  const modalizeRef = React.useRef(null);
  const [height, setHeight] = React.useState(initialHeight);
  const [isLoading, setIsLoading] = React.useState(false);
  const handleLayout = ({ layout }) => {
    setHeight(layout.height);
  };

  React.useEffect(() => {
    CookieManager.clearAll()
      .then((success) => {
        console.log('CookieManager.clearAll =>', success);
      });
  }, []);

  const jsCode = 'window.ReactNativeWebView.postMessage(document.cookie)';

  const onPressLogin = React.useCallback(() => {
    modalizeRef.current?.open();
    setIsLoading(true);
    dispatch(requestInsCookies());
  }, []);

  const onSuccessfulLogin = React.useCallback(() => {
    modalizeRef.current?.close();
    setIsLoading(false);
  }, []);

  const onNavigationStateChange = webViewState => {
    const { url } = webViewState;
    // when WebView.onMessage called, there is not-http(s) url
    if (url.includes('http')) {
      console.log('webViewUrl', url);
      setIsLoading(false);
    }
  };

  const _onMessage = async event => {
    const { data } = event.nativeEvent;
    console.log('data', data);
    const cookies = data.split(';'); // `csrftoken=...; rur=...; mid=...; somethingelse=...`
    console.log('cookies', cookies);
    const cookiesObj = cookies.reduce((obj, cookie) => {
      const c = cookie.trim().split('=');
      obj[c[0]] = c[1];
      return obj;
    }, {});

    CookieManager.getAll()
      .then((cookies) => {
        console.log('CookieManager.getAll =>', cookies);
      });
    if (isExist(cookiesObj.ds_user_id)) {
      dispatch(receiveInsCookies(cookiesObj));
      // onSuccessfulLogin();
      // navigation.navigate('Home');
      await delay(1000);
      const profile = await dispatch(fetchInsUserProfileAction());
      if (profile?.username === undefined || profile?.username === 'undefined') {
        return;
      }
      setUserName(profile?.username);
      dispatch(newLogin(profile));
    }
  };

  return (
    <Container>
      <BackgroundImage source={require('assets/splash.png')} />
      <LoginButton onPress={onPressLogin} />
      <Modalize ref={modalizeRef} onLayout={handleLayout} modalTopOffset={15}>
        {isLoading && <StyledActivityIndicator size="large" color="black" />}
        <WebView
          style={{ height }}
          source={{ uri: 'https://instagram.com/accounts/login/' }}
          onNavigationStateChange={onNavigationStateChange}
          onMessage={_onMessage}
          injectedJavaScript={jsCode}
          thirdPartyCookiesEnabled={true}
          cacheMode="LOAD_NO_CACHE"
        // incognito={true}
        />
      </Modalize>
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
  max-width: 300;
  height: 60;
  border-radius: 12;
  margin-top: auto;
  margin-bottom: 40%;
  background-color: #32c5ff;
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
          Login with Instagram
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
