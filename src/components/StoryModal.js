import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, LayoutAnimation, Animated, PanResponder } from 'react-native';
import { of, applySpec, path, compose, map, prop, __, into, filter } from 'ramda';
import { connect } from 'react-redux';
import { branch, withProps } from 'recompose';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components/native';
import SystemSetting from 'react-native-system-setting'


import Stories from 'components/story/Stories';
import useIsMount from 'hooks/useIsMount';
import { storyFeedListSelector, storyFeedPositionSelector } from 'modules/instagram/selector';
import useStoryData from 'hooks/useStoryData';
import { isExist } from 'utils/ramdaUtils';

const { width, height } = Dimensions.get('window');
const VERTICAL_THRESHOLD = 80;
const HORIZONTAL_THRESHOLD = 60;

const StyledView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-top: 20;
`;

const selector = createStructuredSelector({
  data: storyFeedListSelector,
  deckPosition: storyFeedPositionSelector,
});

const orderByList = (orderList, object) =>
  into([], compose(map(prop(__, object)), filter(isExist)), orderList);

const StoryModal = ({ route, navigation, data, deckPosition }) => {
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
    deckIdx: deckIndex,
    isPanRelease: false,
    paused: false,
    backOpacity: 0,
    panResponder: null,
    currentStoryIdx: null,
    audioOn: false,
  };

  const [storyState, setStoryState] = useState(initialState);
  const isMount = useIsMount();

  const { carouselOpen, paused, backOpacity, deckIdx, isPanRelease, currentStoryIdx, audioOn } = storyState;

  const { setStoryIdx, stories, getDeckInfo, isFetchingStories, getPartialList } = useStoryData(
    data,
    deckIdx,
    deckPosition,
  );

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
        if (swipedHorizontally.current) {
          horizontalSwipe.setOffset(horizontalSwipe._value);
          horizontalSwipe.setValue(0);
        }
        setIsReleasePan(false);
        pauseIndicator();
        setBackOpacity(0);
      },
      onPanResponderMove: (e, { dx, dy }) => {
        if (swipedHorizontally.current) {
          horizontalSwipe.setValue(-dx);
        } else {
          verticalSwipe.setValue(dy);
        }
      },
      onPanResponderRelease: (e, { dx, dy }) => {
        if (!swipedHorizontally.current) {
          if (dy > VERTICAL_THRESHOLD) return leaveStories();
          playProgressIndicator();
          verticalSwipe.setValue(0);
          // return resetVerticalSwipe();
          return;
        }
        horizontalSwipe.flattenOffset();
        // setStoryState(prev => {
        //   return { ...prev, horizontalSwipe };
        // });

        if (dx > HORIZONTAL_THRESHOLD) {
          return onPrevDeck();
        }

        if (dx < -HORIZONTAL_THRESHOLD) {
          return onNextDeck();
        }
        playProgressIndicator();
        setIsReleasePan(true);
      },
    }),
  ).current;

  ////////////////////////////////////////////

  // Toggle Carousel
  const openCarousel = (idx, offset) => {
    horizontalSwipe.setValue(idx * width);
    setStoryState(prev => ({
      ...prev,
      offset,
      deckIdx: idx,
    }));
    requestAnimationFrame(() => {
      LayoutAnimation.easeInEaseOut();
      setStoryState(prev => ({ ...prev, carouselOpen: true }));
      // animateIndicator();
    });
  };

  const dismissCarousel = () => {
    LayoutAnimation.easeInEaseOut();
    setStoryState(prev => ({ ...prev, carouselOpen: false }));
  };

  const leaveStories = () => {
    indicatorAnim.stopAnimation();
    dismissCarousel();
    navigation.goBack();
  };

  // Setter
  // const setStoryIdx = diff => {
  //   setStoryState(prev => ({
  //     ...prev,
  //     stories: adjust(prev.deckIdx, evolve({ idx: add(diff) }), prev.stories),
  //   }));
  //   storyData.setStoryIdx(diff);
  // };

  const setDeckIdxDiff = difference =>
    setStoryState(prev => ({ ...prev, deckIdx: prev.deckIdx + difference }));

  const setBackOpacity = backOpacity => setStoryState(prev => ({ ...prev, backOpacity }));

  // Toggle Indicator Animation

  const pauseIndicator = () => {
    setStoryState(prev => ({ ...prev, paused: true }));
  };

  const playProgressIndicator = () => {
    setStoryState(prev => ({ ...prev, paused: false }));
  };

  const animateIndicator = (reset = true) => {
    if (reset) {
      indicatorAnim.setValue(0);
    }
    requestAnimationFrame(() => {
      Animated.timing(indicatorAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onNextItem();
      });
    });
  };

  // Navigate Story Items
  const onNextItem = () => {
    // if (paused) return playProgressIndicator();
    const story = getDeckInfo(deckIdx);
    if (story.idx >= story?.items.length - 1) {
      onNextDeck();
    } else {
      setStoryIdx(1);
    }
  };

  const onPrevItem = () => {
    if (backOpacity === 1) setStoryState(prev => ({ ...prev, backOpacity: 0 }));
    const story = getDeckInfo(deckIdx);
    if (story.idx === 0) {
      onPrevDeck();
    } else {
      setStoryIdx(-1);
    }
  };

  // Navigate Deck Items
  const onNextDeck = () => {
    setDeckIdxDiff(1);
  };
  const onPrevDeck = () => {
    setDeckIdxDiff(-1);
  };

  const animateDeck = (toValue, reset = false) => {
    if (reset) {
      animateIndicator(reset);
    }
    Animated.spring(horizontalSwipe, {
      toValue,
      friction: 9,
      useNativeDriver: false,
    }).start();
  };

  const setIsReleasePan = tof => setStoryState(prev => ({ ...prev, isPanRelease: tof }));

  useEffect(() => {
    if (paused || isFetchingStories) {
      indicatorAnim.stopAnimation();
    } else {
      animateIndicator(false);
    }
  }, [paused, isFetchingStories]);

  useEffect(() => {
    if (isMount || isPanRelease) {
      if (deckIdx < deckPosition.length && deckIdx >= 0) {
        if (paused) {
          playProgressIndicator();
          // animateIndicator(false);
        }
        console.log('CHUCK', 'before animate deck');
        animateDeck(deckIdx * width, true);
      } else {
        leaveStories();
      }
    }
  }, [deckIdx, isPanRelease]);

  useEffect(() => {
    const isDeckInRange = deckIdx >= 0 && deckIdx < deckPosition.length;
    if (isMount && isDeckInRange) {
      animateIndicator();
      setStoryState(prev => ({ ...prev, currentStoryIdx: getDeckInfo(deckIdx)?.idx }));
    }
  }, [getDeckInfo(deckIdx)?.idx]);

  useEffect(() => {
    try {
      const volumeListener = SystemSetting.addVolumeListener(() => {
        setStoryState(prev => ({ ...prev, audioOn: true }))
      });
    } catch(e){
      console.log('volumeListener error: ' , e);
    }
    return () => { SystemSetting.removeVolumeListener(volumeListener) }
  }, []);

  const functions = {
    openCarousel,
    dismissCarousel,
    leaveStories,
    setBackOpacity,
    // resetVerticalSwipe,
    onNextItem,
    onPrevItem,
    onNextDeck,
    onPrevDeck,
    // currentStory,
  };

  return (
    <StyledView>
      <CarouselWrap carouselOpen={carouselOpen}>
        <Stories
          stories={orderByList(getPartialList(2, deckIdx, deckPosition), stories)}
          storyState={storyState}
          setStoryState={setStoryState}
          panResponder={panResponder}
          functions={functions}
          indicatorAnim={indicatorAnim}
          horizontalSwipe={horizontalSwipe}
          verticalSwipe={verticalSwipe}
          swipedHorizontally={swipedHorizontally.current}
        />
      </CarouselWrap>
    </StyledView>
  );
};

StoryModal.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
  data: PropTypes.object,
  deckPosition: PropTypes.array,
};

export default compose(
  branch(
    compose(isExist, path(['route', 'params', 'story'])),
    withProps(
      applySpec({
        data: path(['route', 'params', 'story']),
        deckPosition: compose(of, path(['route', 'params', 'userId'])),
      }),
    ),
    connect(selector),
  ),
)(StoryModal);

const CarouselWrap = styled(View)`
  overflow: hidden;
  position: absolute;
  left: ${props => (props.carouselOpen ? 0 : width / 2)};
  top: ${props => (props.carouselOpen ? 0 : height / 2)};
  width: ${props => (props.carouselOpen ? width : 0)};
  height: ${props => (props.carouselOpen ? height : 0)};
`;
