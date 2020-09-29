import * as React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CancelButton = ({ onPress, style }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Image
        style={{ width: 30, height: 30, marginLeft: 16 }}
        source={require('assets/icons/cancel.png')}
      />
    </TouchableOpacity>
  );
};

export default CancelButton;
