import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { TouchableOpacity, Dimensions, View } from 'react-native';
import { isExist } from 'utils/ramdaUtils';
import FastImage from 'react-native-fast-image';
import {
  InteractionWithValue,
  InteractionIcon,
} from '../modules/insights/components/InteractionWithValue';

const { width: screenWidth } = Dimensions.get('window');

export const POST_ITEM_WIDTH = (screenWidth - 4) / 3;

const Img = styled(FastImage)`
  width: ${(screenWidth - 4) / 3};
  height: ${(screenWidth - 4) / 3};
  margin-bottom: 2;
  margin-right: 2;
`;

const Mask = styled(View)`
  padding-left: 6;
  padding-bottom: 6;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.25);
`;

const InteractionWrapper = React.memo(({ iconType, value }) => (
  <View style={{ height: 18, flexDirection: 'row', marginBottom: 5 }}>
    {iconType === 'like' && (
      <InteractionWithValue
        iconSlot={<InteractionIcon source={require('assets/icons/like_small.png')} />}
        value={value}
      />
    )}
    {iconType === 'comment' && (
      <InteractionWithValue
        iconSlot={<InteractionIcon source={require('assets/icons/comment_small.png')} />}
        value={value}
      />
    )}
  </View>
));

const PostItem = ({ likes, comments, src, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ position: 'relative' }}>
    <Img
      source={{
        ...src,
        priority: FastImage.priority.normal,
      }}
      resizeMode={FastImage.resizeMode.contain}
    />
    <Mask>
      {isExist(likes) && <InteractionWrapper iconType="like" value={likes} />}
      {isExist(comments) && <InteractionWrapper iconType="comment" value={comments} />}
    </Mask>
  </TouchableOpacity>
);

PostItem.propTypes = {
  likes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  comments: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  src: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  onPress: PropTypes.func,
};

export default React.memo(PostItem);
