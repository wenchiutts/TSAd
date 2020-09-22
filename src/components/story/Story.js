import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  ImageBackground,
  LayoutAnimation,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

import ProgressBar from 'components/story/ProgressBar';
import Image from 'react-native-image-progress';
import CircleSnail from 'react-native-progress/CircleSnail';

import CancelButton from 'components/header/CancelButton';

const { width, height } = Dimensions.get('window');

const Story = ({ story, currentDeck, storyState, setStoryState, functions }) => {
  const navigation = useNavigation();
  const {
    stories,
    indicatorAnim,
    carouselOpen,
    deckIdx,
    paused,
    backOpacity,
    horizontalSwipe,
    verticalSwipe,
    swipedHorizontally,
  } = storyState;

  const { onNextItem, onPrevItem, pause, dismissCarousel, setBackOpacity } = functions;

  const onPress = () => {
    dismissCarousel();
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onNextItem}
      delayPressIn={200} //onPressIn={pause}
    >
      <View>
        <CancelButton
          onPress={onPress}
          style={{ marginTop: 5, marginBottom: 12 }}
          setStoryState={setStoryState}
        />
        <StyledImage source={{ uri: story.items[story.idx].src }}>
          <StoryIndicator story={story} currentDeck={currentDeck} indicatorAnim={indicatorAnim} />
          <BackButton
            onPrevItem={onPrevItem}
            setBackOpacity={setBackOpacity}
            backOpacity={backOpacity}
          />
        </StyledImage>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Story;

const StoryIndicator = ({ story, currentDeck, indicatorAnim }) => (
  <IndicatorsWrap>
    <StyledLinearGradient colors={['rgba(0,0,0,0.33)', 'transparent']} locations={[0, 0.95]} />
    <Indicators>
      {story.items.map((item, i) => (
        <ProgressBar
          key={i}
          i={i}
          animate={currentDeck && story.idx == i}
          story={story}
          indicatorAnim={indicatorAnim}
        />
      ))}
    </Indicators>
  </IndicatorsWrap>
);

const IndicatorsWrap = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

const StyledLinearGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50;
`;

const Indicators = styled(View)`
  height: 20;
  align-items: center;
  padding-horizontal: 8;
  flex-direction: row;
},
`;

const StyledImage = styled(Image)`
  width: ${width};
  height: ${height};
`;

const BackButton = ({ onPrevItem, backOpacity, setBackOpacity }) => (
  <TouchableWithoutFeedback
    onPress={onPrevItem}
    onPressIn={() => setBackOpacity(1)}
    onLongPress={() => setBackOpacity(0)}>
    <BackButtonGradient
      colors={['rgba(0,0,0,0.33)', 'transparent']}
      locations={[0, 0.85]}
      start={[0, 0]}
      end={[1, 0]}
      style={{
        opacity: backOpacity,
      }}
    />
  </TouchableWithoutFeedback>
);

const BackButtonGradient = styled(LinearGradient)`
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 90;
`;
