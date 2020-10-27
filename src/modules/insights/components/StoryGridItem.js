// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

import { InteractionWithValue, InteractionIcon } from './InteractionWithValue';
import { isExist } from 'utils/ramdaUtils';

const { width: screenWidth } = Dimensions.get('window');

const Img = styled(FastImage)`
  flex: 1;
  justify-content: center;
`;

const StyledView = styled(TouchableOpacity)`
  position: relative;
  width: ${(screenWidth - 4) / 3};
  height: 245.5;
`;

const Overlay = styled(View)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.25);
`;

const StyledInteractionWithValue = styled(InteractionWithValue)`
  position: absolute;
  bottom: 12;
  left: 8;
`;

const StoryGridItem = ({ storyId, imgSrc, viewsCount = 592, style, onPress }) => {
  const navigation = useNavigation();
  return (
    <StyledView
      style={style}
      onPress={() => {
        navigation.navigate('StoryDetailInsight', {
          storyId,
        });
        apis.firebase.logEvent({ name: 'onPress_StoryDetailInsight' });
      }}
    >
      <Img
        source={{ uri: imgSrc, priority: FastImage.priority.normal }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <Overlay />
      {isExist(viewsCount) && (
        <StyledInteractionWithValue
          iconSlot={
            <InteractionIcon source={require('assets/icons/followstatus_visit_small.png')} />
          }
          value={viewsCount}
        />
      )}
    </StyledView>
  );
};

StoryGridItem.propTypes = {
  storyId: PropTypes.string,
  imgSrc: PropTypes.string,
  viewsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.array,
  onPress: PropTypes.func,
};

export default StoryGridItem;
