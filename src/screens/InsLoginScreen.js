import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WebView } from 'react-native-webview';
import CookieManager from '@react-native-community/cookies';
import messaging from '@react-native-firebase/messaging';
import delay from 'delay';

import {
  requestInsCookies,
  receiveInsCookies,
  fetchInsUserProfileAction,
} from 'modules/instagram/insAuthActions';
import { IgUserNameContext } from 'modules/instagram/useCheckUserLoginIg';

import {
  newLogin,
} from 'actions/userActions';
import i18n from 'i18n';

const jsCode = 'window.ReactNativeWebView.postMessage(document.cookie)';

const InsLoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { setUserName } = React.useContext(IgUserNameContext);
  const sessionid = useSelector(state => state?.instagram?.cookies?.sessionid);

  React.useEffect(() => {
    console.log('init login');
    // CookieManager.getAll(true).then(cookies => console.log('init cookies', cookies));
  }, []);

  const fetchCookies = async (retry = 0) => {
    // console.log('sessionId', sessionid);
    if (retry > 15 || !!sessionid) {
      return;
    }
    const cookies = await CookieManager.get('https://www.instagram.com', true);
    // const cookies = await CookieManager.get('https://www.instagram.com');
    // console.log('fuck cookies', cookies);
    // alert('get Cookiesss' + cookies?.sessionid?.value);
    if (cookies?.csrftoken?.value && cookies?.sessionid?.value) {
      await Promise.all(Object.keys(cookies).map(cookieName => {
        return CookieManager.set('https://www.instagram.com', cookies[cookieName], false);
      }));

      try {
        // alert(cookies?.sessionid?.value + ': ' + retry);
        dispatch(receiveInsCookies({
          csrftoken: cookies?.csrftoken?.value,
          sessionid: cookies?.sessionid?.value
        }));
        const profile = await dispatch(fetchInsUserProfileAction());
        // console.log('profile', profile);
        if (profile?.username === undefined || profile?.username === 'undefined') {
          // alert('no username')
          return;
        }
        setUserName(profile?.username);
        dispatch(newLogin(profile));
        messaging().requestPermission();
      } catch (e) {
        console.log('_onMessage error', e);
      }
    }
    else {
      await delay(800);
      fetchCookies(retry + 1);
    }
  };

  const onNavigationStateChange = async webViewState => {
    const { url } = webViewState;
    // alert(url);
    if (url?.indexOf('onetap') > 0) {
      // alert(url);
      fetchCookies();
    }
    if (url === 'https://www.instagram.com/') {
      fetchCookies();
      navigation.navigate('Login');
    }
  };

  return (
    <WebView
      style={{ width: '100%', height: '100%' }}
      source={{ uri: 'https://www.instagram.com/accounts/login/' }}
      onNavigationStateChange={onNavigationStateChange}
      // onMessage={fetchCookies}
      // injectedJavaScript={jsCode}
      // thirdPartyCookiesEnabled={true}
      cacheMode="LOAD_NO_CACHE"
      cacheEnabled={false}
    // sharedCookiesEnabled
    // onLoadEnd={async (syntheticEvent) => {
    //   fetchCookies();
    // }}
    // incognito={true}
    />
  );
};

export default InsLoginScreen;