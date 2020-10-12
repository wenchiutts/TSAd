import * as React from 'react';
import PropTypes from 'prop-types';
import { compose, isEmpty, path } from 'ramda';
import { View, Dimensions, TouchableWithoutFeedback, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

import ProgressBar from 'components/story/ProgressBar';
import Image from 'react-native-image-progress';

import CancelButton from 'components/header/CancelButton';
import Spinner from 'components/Spinner';
import StoryAvatar from 'components/story/StoryAvatar';

const { width, height } = Dimensions.get('window');

const isEmptyStories = compose(isEmpty, path(['items']));

const SpinnerWrapper = styled(View)`
  width: ${width};
  height: ${height};
`;

const StyledAvatar = styled(StoryAvatar)`
  position: absolute;
  top: 14;
  left: 16;
`;

const Story = ({ story, isVisible, backOpacity, functions, indicatorAnim }) => {
  const navigation = useNavigation();

  const { onNextItem, onPrevItem, dismissCarousel, setBackOpacity } = functions;

  const onPress = () => {
    dismissCarousel();
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={onNextItem} delayPressIn={200}>
      <View>
        <CancelButton onPress={onPress} style={{ marginTop: 5, marginBottom: 12 }} />
        {isEmptyStories(story) && (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        )}
        {!isEmptyStories(story) && (
          <StyledImage source={{ uri: story?.items[story.idx].src }}>
            <StoryIndicator story={story} isVisible={isVisible} indicatorAnim={indicatorAnim} />
            <StyledAvatar
              imgSrc={{ uri: story?.user?.profile_pic_url }}
              username={story?.user?.username}
              createTime={story?.items[story.idx].takenAt}
            />
            <BackButton
              onPrevItem={onPrevItem}
              setBackOpacity={setBackOpacity}
              backOpacity={backOpacity}
            />
          </StyledImage>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

Story.propTypes = {
  story: PropTypes.object,
  isVisible: PropTypes.bool,
  backOpacity: PropTypes.number,
  functions: PropTypes.object,
  indicatorAnim: PropTypes.instanceOf(Animated.Value),
};

export default Story;

const StoryIndicator = ({ story, isVisible, indicatorAnim }) => (
  <IndicatorsWrap>
    <StyledLinearGradient colors={['rgba(0,0,0,0.33)', 'transparent']} locations={[0, 0.95]} />
    <Indicators>
      {story?.items.map((item, i) => (
        <ProgressBar
          key={i}
          i={i}
          animate={isVisible && story.idx === i}
          story={story}
          indicatorAnim={indicatorAnim}
        />
      ))}
    </Indicators>
  </IndicatorsWrap>
);

StoryIndicator.propTypes = {
  story: PropTypes.object,
  isVisible: PropTypes.bool,
  indicatorAnim: PropTypes.instanceOf(Animated.Value),
};

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

BackButton.propTypes = {
  onPrevItem: PropTypes.func,
  backOpacity: PropTypes.number,
  setBackOpacity: PropTypes.func,
};

const BackButtonGradient = styled(LinearGradient)`
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 90;
`;
