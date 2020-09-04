import axios from 'axios';

export const getTime = async () => {
  try {
    const res = await axios.get('http://worldtimeapi.org/api/ip');
    return res;
  } catch (e) {
    if (__DEV__) {
      console.log('getTime api error', e);
    }
    return {};
  }
};
