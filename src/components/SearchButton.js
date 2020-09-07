import * as React from 'react';
import { TouchableOpacity, Image } from 'react-native';

const SearchButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image style={{ width: 30, height: 30 }} source={require('assets/icons/search.png')} />
    </TouchableOpacity>
  );
};

export default SearchButton;
