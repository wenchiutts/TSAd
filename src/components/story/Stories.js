import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Dimensions, Animated, StatusBar } from 'react-native';
import styled from 'styled-components/native';

import Story from 'components/story/Story';

const { width, height } = Dimensions.get('window');

const Stories = ({
  storyState,
  setStoryState,
  functions,
  panResponder,
  indicatorAnim,
  horizontalSwipe,
  verticalSwipe,
  swipedHorizontally,
  stories,
}) => {
  const { backOpacity, deckIdx, currentStoryIdx,audioOn } = storyState;

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

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
            key={story?.id}
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
              isVisible={deckIdx === idx}
              backOpacity={backOpacity}
              functions={functions}
              indicatorAnim={indicatorAnim}
              currentStoryIdx={currentStoryIdx}
              audioOn={audioOn}
            />
          </Animated.View>
        );
      })}
    </Wrapper>
  );
};

Stories.propTypes = {
  storyState: PropTypes.object,
  setStoryState: PropTypes.func,
  functions: PropTypes.object,
  panResponder: PropTypes.object,
  indicatorAnim: PropTypes.instanceOf(Animated.Value),
  horizontalSwipe: PropTypes.instanceOf(Animated.Value),
  verticalSwipe: PropTypes.instanceOf(Animated.Value),
  swipedHorizontally: PropTypes.bool,
  stories: PropTypes.array,
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
