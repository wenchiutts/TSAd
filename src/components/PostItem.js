import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Text, Image, TouchableOpacity, ImageBackground, Dimensions, View } from 'react-native';
import { path } from 'ramda';
import { isExist } from 'utils/ramdaUtils';

const { width: screenWidth } = Dimensions.get('window');

const Img = styled(ImageBackground)`
  width: ${(screenWidth - 4) / 3};
  height: ${(screenWidth - 4) / 3};
  margin-bottom: 2;
  margin-right: 2;
`;

const Mask = styled(View)`
  width: ${(screenWidth - 4) / 3};
  height: ${(screenWidth - 4) / 3};
  flex: 1;
  background-color: rgba(0, 0, 0, 0.25);
  padding-left: 6;
  padding-bottom: 6;
  justify-content: flex-end;
`;

const StyledIcon = styled(Image)`
  width: 20;
  height: 20;
  margin-right: 8;
`;

const Interaction = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
`;

const InteractionWrapper = ({ iconType, value }) => (
  <View style={{ height: 18, flexDirection: 'row', marginBottom: 5 }}>
    {iconType === 'like' && <StyledIcon source={require('assets/icons/like_small.png')} />}
    {iconType === 'comment' && <StyledIcon source={require('assets/icons/comment_small.png')} />}
    <Interaction>{value}</Interaction>
  </View>
);

const PostItem = ({ likes, comments, src, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Img source={src}>
      <Mask>
        {isExist(likes) && <InteractionWrapper iconType="like" value={likes} />}
        {isExist(comments) && <InteractionWrapper iconType="comment" value={comments} />}
      </Mask>
    </Img>
  </TouchableOpacity>
);

PostItem.propTypes = {
  likes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  comments: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  src: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  onPress: PropTypes.func,
};

export default PostItem;
