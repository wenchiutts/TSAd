// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { ImageBackground, View, Dimensions } from 'react-native';
import { InteractionWithValue, InteractionIcon } from './InteractionWithValue';
import { isExist } from 'utils/ramdaUtils';

const { width: screenWidth } = Dimensions.get('window');

const Img = styled(ImageBackground)`
  flex: 1;
  resize-mode: contain;
  justify-content: center;
`;

const StyledView = styled(View)`
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

const StoryGridItem = ({ imgSrc, viewsCount = 592 }) => (
  <StyledView>
    <Img source={{ uri: imgSrc }}>
      <Overlay />
      {isExist(viewsCount) && (
        <StyledInteractionWithValue
          iconSlot={
            <InteractionIcon source={require('assets/icons/followstatus_visit_small.png')} />
          }
          value={viewsCount}
        />
      )}
    </Img>
  </StyledView>
);

StoryGridItem.propTypes = {
  imgSrc: PropTypes.string,
  viewsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default StoryGridItem;
