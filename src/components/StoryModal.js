import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  Dimensions,
  LayoutAnimation,
  Animated,
  PanResponder,
} from 'react-native';
import styled from 'styled-components/native';
import * as Progress from 'react-native-progress';

import Stories from 'components/story/Stories';
import data from 'components/story/data';

const { width, height } = Dimensions.get('window');
const VERTICAL_THRESHOLD = 80;
const HORIZONTAL_THRESHOLD = 60;

const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 20;
`;

const StoryModal = ({ route }) => {
  const { deckIndex } = route.params;
  const indicatorAnimInit = useRef(new Animated.Value(0)).current;
  const horizontalSwipeInit = useRef(new Animated.Value(0)).current;
  const verticalSwipeInit = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const offset = { top: 30, left: 30 };
    openCarousel(deckIndex, offset);
  }, [deckIndex]);

  const initialState = {
    carouselOpen: false,
    offset: { top: height / 2, left: width / 2 },
    stories: data,
    deckIdx: deckIndex,
    paused: false,
    backOpacity: 0,
    indicatorAnim: indicatorAnimInit,
    horizontalSwipe: horizontalSwipeInit,
    verticalSwipe: verticalSwipeInit,
    swipedHorizontally: true,
    panResponder: null,
  };

  const [storyState, setStoryState] = useState(initialState);

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

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, { dx, dy }) => {
        if (Math.abs(dx) > 5) {
          setStoryState(prev => {
            return { ...prev, swipedHorizontally: true };
          });
          return true;
        }

        if (dy > 5) {
          setStoryState(prev => {
            return { ...prev, swipedHorizontally: false };
          });
          return true;
        }
        return false;
      },
      onPanResponderGrant: () => {
        if (swipedHorizontally) {
          horizontalSwipe.setOffset(horizontalSwipe._value);
          horizontalSwipe.setValue(0);
          setStoryState(prev => {
            return { ...prev, horizontalSwipe };
          });
        }
        setStoryState(prev => {
          return { ...prev, paused: true, backOpacity: 0 };
        });
      },
      onPanResponderMove: (e, { dx, dy }) => {
        if (swipedHorizontally) {
          horizontalSwipe.setValue(-dx);
          setStoryState(prev => {
            return { ...prev, horizontalSwipe };
          });
        } else {
          verticalSwipe.setValue(dy);
          setStoryState(prev => {
            return { ...prev, verticalSwipe };
          });
        }
      },
      onPanResponderRelease: (e, { dx, dy }) => {
        if (!swipedHorizontally) {
          if (dy > VERTICAL_THRESHOLD) return leaveStories();
          play();
          return resetVerticalSwipe();
        }
        horizontalSwipe.flattenOffset();
        setStoryState(prev => {
          return { ...prev, horizontalSwipe };
        });
        if (dx > HORIZONTAL_THRESHOLD) {
          if (deckIdx == 0) return leaveStories();
          return animateDeck(width * (deckIdx - 1), true);
        }

        if (dx < -HORIZONTAL_THRESHOLD) {
          if (deckIdx == stories.length - 1) return leaveStories();
          return animateDeck(width * (deckIdx + 1), true);
        }
        play();
        return animateDeck(width * deckIdx);
      },
    }),
  ).current;

  ////////////////////////////////////////////

  // Toggle Carousel
  const openCarousel = (idx, offset) => {
    horizontalSwipe.setValue(idx * width);
    setStoryState(prev => {
      return {
        ...prev,
        offset,
        deckIdx: idx,
        horizontalSwipe,
      };
    });
    requestAnimationFrame(() => {
      LayoutAnimation.easeInEaseOut();
      setStoryState(prev => {
        return { ...prev, carouselOpen: true };
      });
      animateIndicator();
    });
  };

  const dismissCarousel = () => {
    LayoutAnimation.easeInEaseOut();
    setStoryState(prev => {
      return { ...prev, carouselOpen: false };
    });
  };

  const leaveStories = () => {
    if (swipedHorizontally) {
      animateDeck(width * deckIdx);
    } else {
      resetVerticalSwipe();
    }
    dismissCarousel();
    navigation.goBack();
  };

  // Setter
  const setStoryIdx = idx => {
    const updatedStory = { ...stories[deckIdx], idx };
    stories.splice(deckIdx, 1, updatedStory);
    setStoryState(prev => {
      return { ...prev, stories };
    });
  };

  const setDeckIdx = deckIdx => {
    console.log('setDeckIdx', deckIdx);
    setStoryState(prev => {
      return { ...prev, deckIdx };
    });
  };

  const setBackOpacity = backOpacity => {
    setStoryState(prev => {
      return { ...prev, backOpacity };
    });
  };

  // Toggle Indicator Animation

  const pause = () => {
    indicatorAnim.stopAnimation();
    setStoryState(prev => {
      return { ...prev, paused: true, indicatorAnim };
    });
  };

  const play = () => {
    console.log(paused);
    if (paused) {
      setStoryState(prev => {
        return { ...prev, paused: false };
      });
      animateIndicator(false);
    }
  };

  const animateIndicator = (reset = true) => {
    if (reset) {
      console.log('animateIndicator reset');
      indicatorAnim.setValue(0);
      setStoryState(prev => {
        return { ...prev, indicatorAnim };
      });
    }
    requestAnimationFrame(() => {
      Animated.timing(indicatorAnim, {
        toValue: 1,
        // duration: 5000,
        duration: 5000 * (1 - indicatorAnim._value),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onNextItem();
      });
    });
  };

  const resetVerticalSwipe = () => {
    Animated.spring(verticalSwipe, { toValue: 0 }).start();
  };

  // Navigate Story Items
  const onNextItem = () => {
    console.log('onNextItem');

    play();
    // if (paused) return play();
    const story = stories[deckIdx];

    if (story.idx >= story.items.length - 1) return onNextDeck();

    console.log(
      'onNextItem',
      ' story.idx:',
      story.idx,
      'story.items.length',
      story.items.length,
      'deckIdx',
      deckIdx,
    );
    animateIndicator();
    setStoryIdx(story.idx + 1);
  };

  const onPrevItem = () => {
    if (backOpacity == 1)
      setStoryState(prev => {
        return { ...prev, backOpacity: 0 };
      });
    const story = stories[deckIdx];
    if (story.idx == 0) return onPrevDeck();
    animateIndicator();
    setStoryIdx(story.idx - 1);
  };

  // Navigate Deck Items
  const onNextDeck = () => {
    if (deckIdx >= stories.length - 1) return leaveStories();
    animateDeck((deckIdx + 1) * width, true);
  };
  const onPrevDeck = () => {
    if (deckIdx == 0) return leaveStories();
    animateDeck((deckIdx - 1) * width, true);
  };

  const animateDeck = (toValue, reset = false) => {
    if (reset) {
      setDeckIdx(parseInt(toValue / width));
      animateIndicator();
      console.log('animateDeck Reset', '#toValue:', toValue);
    }
    Animated.spring(horizontalSwipe, {
      toValue,
      friction: 9,
      useNativeDriver: true,
    }).start();
  };

  /////////////////////////////////////////////////////

  const functions = {
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
    // currentStory,
  };

  return (
    <StyledView>
      <CarouselWrap carouselOpen={carouselOpen}>
        <Stories
          storyState={storyState}
          setStoryState={setStoryState}
          panResponder={panResponder}
          functions={functions}
        />
      </CarouselWrap>
    </StyledView>
  );
};
export default StoryModal;

const CarouselWrap = styled(View)`
  overflow: hidden;
  position: absolute;
  left: ${props => (props.carouselOpen ? 0 : width / 2)};
  top: ${props => (props.carouselOpen ? 0 : height / 2)};
  width: ${props => (props.carouselOpen ? width : 0)};
  height: ${props => (props.carouselOpen ? height : 0)};
`;
