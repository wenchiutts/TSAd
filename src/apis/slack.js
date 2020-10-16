import axios from 'axios';
import dedent from 'dedent';
import { Platform } from 'react-native';
import { webhookUrls } from 'constants/Slack';
import { getExpoBundleVersion } from 'utils/system';

export const newUser = data => {
  try {
    if (!__DEV__) {
      const url =
        Platform.OS === 'android'
          ? webhookUrls.newAndroidUser
          : Platform.OS === 'ios'
          ? webhookUrls.newIosUser
          : '';
      const payload = {
        text: dedent`uid: ${data?.uid}
                          countryCode: ${data?.countryCode}
                          country: ${data?.country}
                          timezone: ${data?.timezone}
                          regionName: ${data?.regionName}
                          platform: ${data?.platform}
                          version: ${process.env?.APP_MANIFEST?.version || getExpoBundleVersion()}`,
      };
      axios.post(url, payload).catch(err => console.log('slack err', err.response));
    } 
  } catch (e) {
      console.log('newUser error', e);
  }
};

export const newLogin = data => {
  try {
    if (!__DEV__) {
      const url =
        Platform.OS === 'android'
          ? webhookUrls.newAndroidLogin
          : Platform.OS === 'ios'
          ? webhookUrls.newIosLogin
          : '';
      const payload = {
        text: dedent`uid: ${data?.uid}
              countryCode: ${data?.countryCode}
              country: ${data?.country}
              timezone: ${data?.timezone}
              regionName: ${data?.regionName}
              platform: ${data?.platform}
              username: ${data?.username}
              followingCount: ${data?.followingCount}
              followerCount: ${data?.followerCount}
              avatar: ${data?.profilePicHd}
              version: ${process.env?.APP_MANIFEST?.version || getExpoBundleVersion()}`,
      };
      axios.post(url, payload).catch(err => console.log('slack err', err.response));
    }
  } catch (e) {
     console.log('newLogin error', e);
  }
};

export const newTapPurchase = data => {
  try {
    if (!__DEV__) {
      const url =
        Platform.OS === 'android'
          ? webhookUrls.newAndriodTap
          : Platform.OS === 'ios'
          ? webhookUrls.newIosTap
          : '';
      const payload = {
        text: dedent`uid: ${data?.uid}
                  countryCode: ${data?.countryCode}
                  country: ${data?.country}
                  timezone: ${data?.timezone}
                  regionName: ${data?.regionName}
                  platform: ${data?.platform}
                  username: ${data?.username}
                  followingCount: ${data?.followingCount}
                  followerCount: ${data?.followerCount}
                  avatar: ${data?.profilePicHd}
                  version: ${process.env?.APP_MANIFEST?.version || getExpoBundleVersion()}`,
      };
      axios.post(url, payload).catch(err => console.log('slack err', err.response));
    }
  } catch (e) {
    console.log('newTapPurchase error', e);
  }
};

export const newPurchase = data => {
  try {
    if (!__DEV__) {
      const url =
        Platform.OS === 'android'
          ? webhookUrls.newAndroidPurchase
          : Platform.OS === 'ios'
          ? webhookUrls.newIosPurchase
          : '';
      const payload = {
        text: dedent`uid: ${data?.uid}
          productId: ${data?.productId}
          countryCode: ${data?.countryCode}
          country: ${data?.country}
          timezone: ${data?.timezone}
          regionName: ${data?.regionName}
          platform: ${data?.platform}
          username: ${data?.username}
          followingCount: ${data?.followingCount}
          followerCount: ${data?.followerCount}
          avatar: ${data?.profilePicHd}
          version: ${process.env?.APP_MANIFEST?.version || getExpoBundleVersion()}`,
      };
      axios.post(url, payload).catch(err => console.log('slack err', err.response));
    }
  } catch (e) {
    console.log('newPurchase error', e);
  }
};

export const purchaseError = data => {
  try {
    if (!__DEV__) {
      const url =
        Platform.OS === 'android'
          ? webhookUrls.androidPurchaseError
          : Platform.OS === 'ios'
          ? webhookUrls.iosPurchaseError
          : '';
      const payload = {
        text: dedent`uid: ${data?.uid}
          error: ${data?.error}
          countryCode: ${data?.countryCode}
          country: ${data?.country}
          timezone: ${data?.timezone}
          regionName: ${data?.regionName}
          platform: ${data?.platform} 
          username: ${data?.username}
          followingCount: ${data?.followingCount}
          followerCount: ${data?.followerCount}
          avatar: ${data?.profilePicHd}
          version: ${process.env?.APP_MANIFEST?.version || getExpoBundleVersion()}`,
      };
      axios.post(url, payload).catch(err => console.log('slack err', err.response));
    }
  } catch (e) {
    console.log('purchaseError error', e);
  }
};

export const instagramError = data => {
  try {
    if (!__DEV__) {
      const payload = {
        text: dedent`uid: ${data?.uid}
          countryCode: ${data?.countryCode}
          country: ${data?.country}
          timezone: ${data?.timezone}
          regionName: ${data?.regionName}
          platform: ${data?.platform} 
          username: ${data?.username}
          followingCount: ${data?.followingCount}
          followerCount: ${data?.followerCount}
          avatar: ${data?.profilePicHd}
          error: ${data?.error}
          version: ${process.env?.APP_MANIFEST?.version || getExpoBundleVersion()}`,
      };
      axios
        .post(webhookUrls.instagramError, payload)
        .catch(err => console.log('slack err', err.response));
    }
  } catch (e) {
    console.log('instagramError error', e);
  }
};
