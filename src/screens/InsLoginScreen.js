import * as React from 'react';
import { useDispatch } from 'react-redux';
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


const InsLoginScreen = () => {
  const dispatch = useDispatch();
  const { setUserName } = React.useContext(IgUserNameContext);

  const fetchCookies = async (retry = 0) => {
    if (retry > 3) {
      return;
    }
    await delay(500);
    const cookies = await CookieManager.get('https://www.instagram.com');
    if (cookies?.csrftoken?.value && cookies?.sessionid?.value) {
      try {
        dispatch(receiveInsCookies({
          csrftoken: cookies?.csrftoken?.value
        }));
        const profile = await dispatch(fetchInsUserProfileAction());
        // console.log('profile', profile);
        if (profile?.username === undefined || profile?.username === 'undefined') {
          return;
        }
        setUserName(profile?.username);
        dispatch(newLogin(profile));
        messaging().requestPermission();
      } catch (e) {
        console.log('_onMessage error', e);
      }
    } else {
      fetchCookies(retry + 1);
    }
  };

  const onNavigationStateChange = async webViewState => {
    console.log('webViewState', webViewState)
    fetchCookies();
  };

  return (
    <WebView
      style={{ width: '100%', height: '100%' }}
      source={{ uri: 'https://instagram.com/accounts/login/' }}
      onNavigationStateChange={onNavigationStateChange}
      // onMessage={_onMessage}
      // injectedJavaScript={jsCode}
      // thirdPartyCookiesEnabled={true}
      cacheMode="LOAD_NO_CACHE"
      cacheEnabled={false}
      sharedCookiesEnbaeld={true}
    // incognito={true}
    />
  );
};

export default InsLoginScreen;