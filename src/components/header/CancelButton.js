import * as React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CancelButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        style={{ width: 30, height: 30, marginLeft: 16 }}
        source={require('assets/icons/cancel.png')}
      />
    </TouchableOpacity>
  );
};

export default CancelButton;
