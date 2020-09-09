// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Modalize } from 'react-native-modalize';
import styled from 'styled-components/native';

import { isExist } from 'utils/ramdaUtils';
import {
  requestInsCookies,
  receiveInsCookies,
  fetchInsUserProfileAction,
} from 'modules/instagram/insAuthActions';
import { IgUserNameContext } from 'modules/instagram/useCheckUserLoginIg';

// import {
//   newLogin,
//   receiveInsCookies,
//   fetchInsUserProfileAction
// } from 'actions/userActions';

const { height: initialHeight } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { setUserName } = React.useContext(IgUserNameContext);
  const dispatch = useDispatch();
  const modalizeRef = React.useRef(null);
  const [height, setHeight] = React.useState(initialHeight);
  const [isLoading, setIsLoading] = React.useState(false);
  const handleLayout = ({ layout }) => {
    setHeight(layout.height);
  };

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

    const cookiesObj = cookies.reduce((obj, cookie) => {
      const c = cookie.trim().split('=');
      obj[c[0]] = c[1];
      return obj;
    }, {});

    if (isExist(cookiesObj.ds_user_id)) {
      dispatch(receiveInsCookies(cookiesObj));
      onSuccessfulLogin();
      // navigation.navigate('Home');
      const profile = await dispatch(fetchInsUserProfileAction());
      setUserName(profile?.username);
      // dispatch(newLogin());
    }
  };

  return (
    <Container>
      <BackgroundImage source={require('assets/images/signuploginbg.png')} />
      <GradientLayer />
      <LoginLogo source={require('assets/images/signup_pic.png')} />
      <LoginButton onPress={onPressLogin} />
      <Modalize ref={modalizeRef} onLayout={handleLayout} modalTopOffset={35}>
        {isLoading && <StyledActivityIndicator size="large" color="black" />}
        <WebView
          style={{ height }}
          source={{ uri: 'https://instagram.com/accounts/login/' }}
          onNavigationStateChange={onNavigationStateChange}
          onMessage={_onMessage}
          injectedJavaScript={jsCode}
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
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 80%;
  max-width: 342;
  height: 60;
  border-radius: 12;
  background-color: #8f71ff;
  margin-top: 65;
`;

const LoginButton = ({ onPress }) => (
  <LoginButtonWrapper onPress={onPress}>
    <Ionicons name="logo-instagram" size={32} color="white" />
    <Text
      style={{
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
      }}>
      Login With Instagram
    </Text>
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
