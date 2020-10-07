import axios from 'axios';
import { Platform } from 'react-native';

export const getCountryCode = async () => {
  try {
    const res = await axios.get('http://ip-api.com/json/');
    const { countryCode, country, timezone, regionName } = res?.data;
    return {
      countryCode,
      country,
      regionName,
      timezone,
    };
  } catch (e) {
    if (__DEV__) {
      console.log('getCountryCode error', e);
    }
    return {};
  }
};
