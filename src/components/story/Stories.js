import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  StatusBar,
  PanResponder,
  LayoutAnimation,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import Story from 'components/story/Story';

const { width, height } = Dimensions.get('window');

const Stories = ({ storyState, setStoryState, functions, panResponder }) => {
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

  const {
    openCarousel,
    dismissCarousel,
    leaveStories,
    setStoryIdx,
    setDeckIdx,
    setBackOpacity,
    pause,
    play,
    animateIndicator,
    resetVerticalSwipe,
    onNextItem,
    onPrevItem,
    onNextDeck,
    onPrevDeck,
    animateDeck,
    currentStory,
  } = functions;

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  functions = { onNextItem, onPrevItem, pause, dismissCarousel, setBackOpacity };

  return (
    <Wrapper {...panResponder.panHandlers}>
      {stories.map((story, idx) => {
        let scale = verticalSwipe.interpolate({
          inputRange: [-1, 0, height],
          outputRange: [1, 1, 0.75],
        });
        if (swipedHorizontally) {
          scale = horizontalSwipe.interpolate({
            inputRange: [width * (idx - 1), width * idx, width * (idx + 1)],
            outputRange: [0.79, 1, 0.78],
          });
        }
        return (
          <Animated.View
            key={idx}
            style={[
              styles.deck,
              {
                transform: [
                  {
                    translateX: horizontalSwipe.interpolate({
                      inputRange: [width * (idx - 1), width * idx, width * (idx + 1)],
                      outputRange: [width, 0, -width],
                    }),
                  },
                  {
                    translateY: verticalSwipe.interpolate({
                      inputRange: [-1, 0, height],
                      outputRange: [0, 0, height / 2],
                    }),
                  },
                  { scale },
                ],
              },
            ]}>
            <Story
              story={story}
              currentDeck={deckIdx == idx}
              storyState={storyState}
              setStoryState={setStoryState}
              functions={functions}
            />
          </Animated.View>
        );
      })}
    </Wrapper>
  );
};

export default Stories;

const Wrapper = styled(View)`
  flex: 1;
`;

const styles = StyleSheet.create({
  deck: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
  },
});
