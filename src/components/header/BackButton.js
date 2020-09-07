import * as React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        style={{ width: 30, height: 30, marginLeft: 16 }}
        source={require('assets/icons/back.png')}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
