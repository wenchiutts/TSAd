import * as React from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { path } from 'ramda';
import { Video } from 'expo-av';
import * as Progress from 'react-native-progress';

import Colors from 'modules/Ads/constants/Colors';
import TSAdBanner from 'modules/Ads/TSAdBanner';
import CancelButton from 'modules/Ads/components/CancelButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const StyledTSAdBanner = styled(TSAdBanner)`
  width: ${screenWidth * 0.8};
  height: 86;
  position: absolute;
  bottom: 0;
  left: 50%;
  elevation: 3;
`;

const ContentContainer = styled(View)`
  width: ${screenWidth};
  height: ${screenHeight - 70};
  background-color: pink;
`;

const CountingdownButton = ({ countNum, setCountNum }) => {
  const progress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();

    setCountNum(5);
    let interval = setInterval(() => setCountNum(prev => prev - 1), 1000);
    setTimeout(() => clearInterval(interval), 5800);
  }, []);

  return (
    <StyledButton>
      <Progress.Circle
        size={32}
        style={{ position: 'absolute' }}
        borderWidth={0}
        color={Colors.purple}
        progress={progress._value}
        thickness={4}
      />
      <StyledText>{countNum}</StyledText>
    </StyledButton>
  );
};

const StyledText = styled(Text)`
  font-size: 14;
  font-weight: bold;
  color: ${Colors.screenBackground};
`;

const StyledButton = styled(TouchableOpacity)`
  position: absolute;
  top: 30;
  left: 16;
  width: 32;
  height: 32;
  border-radius: 16;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled(View)`
  position: relative;
`;

const TSAdFullScreen = ({ route, navigation }) => {
  const [countNum, setCountNum] = React.useState(5);
  const { mediaSource, iconSource, linkUrl } = route?.params;

  return (
    <View style={{ backgroundColor: '#030303', position: 'relative' }}>
      <ButtonWrapper>
        <CancelButton
          onPress={() => navigation.goBack()}
          style={{ marginTop: 30, marginBottom: 10 }}
        />
        {countNum !== 0 && <CountingdownButton countNum={countNum} setCountNum={setCountNum} />}
      </ButtonWrapper>
      <ContentContainer>
        <Video
          source={{ uri: mediaSource }}
          rate={1.0}
          volume={1.0}
          resizeMode="contain"
          shouldPlay={true}
          isLooping
          style={{ width: '100%', height: '100%' }}
        />
        <StyledTSAdBanner
          style={{ transform: [{ translateX: -((screenWidth * 0.8) / 2) }] }}
          iconSource={iconSource}
          linkUrl={linkUrl}
        />
      </ContentContainer>
    </View>
  );
};

export default TSAdFullScreen;
