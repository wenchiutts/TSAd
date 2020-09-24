import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, LayoutAnimation, Animated, PanResponder } from 'react-native';
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

const useIsMount = () => {
  const isMountRef = useRef(false);
  useEffect(() => {
    isMountRef.current = true;
  }, []);
  return isMountRef.current;
};

const StoryModal = ({ route, navigation }) => {
  const { deckIndex } = route.params;
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const horizontalSwipe = useRef(new Animated.Value(0)).current;
  const verticalSwipe = useRef(new Animated.Value(0)).current;
  const swipedHorizontally = useRef(true);

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
    panResponder: null,
  };

  const [storyState, setStoryState] = useState(initialState);
  const isMount = useIsMount();

  const { stories, carouselOpen, paused, backOpacity, deckIdx } = storyState;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, { dx, dy }) => {
        if (Math.abs(dx) > 5) {
          swipedHorizontally.current = true;
          return true;
        }

        if (dy > 5) {
          swipedHorizontally.current = false;
          return true;
        }
        return false;
      },
      onPanResponderGrant: () => {
        if (swipedHorizontally) {
          console.log('onPanResponderGrant true', horizontalSwipe);
          console.log('deckIdx', deckIdx);
          horizontalSwipe.setOffset(horizontalSwipe._value);
          horizontalSwipe.setValue(0);
          console.log(
            'onPanResponderGrant horizontalSwipe reset',
            'value',
            horizontalSwipe._value,
            'offset',
            horizontalSwipe._offset,
          );
        }
        setStoryState(prev => {
          return { ...prev, paused: true, backOpacity: 0 };
        });
      },
      onPanResponderMove: (e, { dx, dy }) => {
        if (swipedHorizontally) {
          horizontalSwipe.setValue(-dx);
          console.log('onPanResponderMove', horizontalSwipe._value);
        } else {
          verticalSwipe.setValue(dy);
        }
      },
      onPanResponderRelease: (e, { dx, dy }) => {
        if (!swipedHorizontally) {
          if (dy > VERTICAL_THRESHOLD) return leaveStories();
          // play();
          // return resetVerticalSwipe();
        }
        horizontalSwipe.flattenOffset();
        console.log(
          'onPanResponderRelease flattenOffset',
          'value',
          horizontalSwipe._value,
          'offset',
          horizontalSwipe._offset,
        );
        // setStoryState(prev => {
        //   return { ...prev, horizontalSwipe };
        // });

        if (dx > HORIZONTAL_THRESHOLD) {
          return onPrevDeck();
        }

        if (dx < -HORIZONTAL_THRESHOLD) {
          return onNextDeck();
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

  const setDeckIdx = action => {
    console.log('setDeckIdx', action);
    if (action === 'plus')
      setStoryState(prev => {
        return { ...prev, deckIdx: prev.deckIdx + 1 };
      });
    if (action === 'minus')
      setStoryState(prev => {
        return { ...prev, deckIdx: prev.deckIdx - 1 };
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
      // animateIndicator(false);
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
        duration: 5000 * (1 - indicatorAnim._value),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onNextItem();
      });
    });
  };

  // Navigate Story Items
  const onNextItem = () => {
    // if (paused) return play();
    const story = stories[deckIdx];
    if (story.idx >= story.items.length - 1) return onNextDeck();
    setStoryIdx(story.idx + 1);
  };

  const onPrevItem = () => {
    if (backOpacity == 1)
      setStoryState(prev => {
        return { ...prev, backOpacity: 0 };
      });
    const story = stories[deckIdx];
    if (story.idx == 0) return onPrevDeck();
    setStoryIdx(story.idx - 1);
  };

  // Navigate Deck Items
  const onNextDeck = () => {
    console.log('onNextDeck deckIdx', deckIdx);
    console.log('onNextDeck horizontalSwipe value', horizontalSwipe);
    if (deckIdx >= stories.length - 1) return leaveStories();
    setDeckIdx('plus');
  };
  const onPrevDeck = () => {
    if (deckIdx == 0) return leaveStories();
    setDeckIdx('minus');
  };

  const animateDeck = (toValue, reset = false) => {
    if (reset) {
      animateIndicator();
      console.log('animateDeck Reset', '#toValue:', toValue);
      console.log('animateDeck horizontalSwipe value', horizontalSwipe);
    }
    Animated.spring(horizontalSwipe, {
      toValue,
      friction: 9,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        console.log(horizontalSwipe._value, toValue);
      }
    });
  };

  useEffect(() => {
    if (isMount) {
      if (paused) animateIndicator(false);
      animateDeck(deckIdx * width, true);
    }
  }, [deckIdx]);

  useEffect(() => {
    if (isMount) {
      animateIndicator();
    }
  }, [stories[deckIdx].idx]);

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
    // resetVerticalSwipe,
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
          indicatorAnim={indicatorAnim}
          horizontalSwipe={horizontalSwipe}
          verticalSwipe={verticalSwipe}
          swipedHorizontally={swipedHorizontally}
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
