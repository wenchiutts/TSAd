import React, { useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import styled from 'styled-components/native';

const ProgressBar = ({ animate, story, i, indicatorAnim }) => {
  const [width, setWidth] = useState(0);

  const setWidthFromLayout = event => {
    const { width } = event.nativeEvent.layout;
    setWidth(width);
  };

  let style = {};

  if (animate) {
    style = {
      transform: [
        {
          translateX: indicatorAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width / 2, 0],
            extrapolate: 'clamp',
          }),
        },
        {
          scaleX: indicatorAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        },
      ],
    };
  } else if (story.idx > i) {
    // seen
    style = { flex: 1 };
  } else if (story.idx <= i) {
    // coming
    style = { width: 0 };
  }

  return (
    <Line onLayout={setWidthFromLayout}>
      <Animated.View style={[{ backgroundColor: 'rgba(255,255,255,0.4)', height: 3 }, style]} />
    </Line>
  );
};

export default ProgressBar;

const Line = styled(View)`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.4);
  margin-horizontal: 2;
  height: 3;
`;
