// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View, Modal, Text } from 'react-native';
import { path } from 'ramda';

import { Avatar } from 'components/AvatarImage';
import ActiveStateButton from 'components/ActiveStateButton';

const CenterView = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ModalView = styled(View)`
  align-items: center;
  background-color: ${path(['theme', 'primary', 'lightPurple'])};
  padding-horizontal: 20;
  padding-vertical: 20;
  border-radius: 8;
`;

const StyledText = styled(Text)`
  margin-top: 15;
  font-size: 14;
  color: ${path(['theme', 'noticeText'])};
`;

const StyledButton = styled(ActiveStateButton)`
  margin-top: 10;
`;

const BlockerModal = ({ user = {}, isBlocker, onPress, ...rest }) => (
  <Modal animationType="slide" transparent {...rest}>
    <CenterView>
      <ModalView>
        <Avatar source={{ uri: user?.profile_pic_url }} />
        <StyledText>{`User @${user.username} is ${
          isBlocker ? '' : 'NOT'
        } blocked you.`}</StyledText>
        <StyledButton text="OK" onPress={onPress} isActive />
      </ModalView>
    </CenterView>
  </Modal>
);

BlockerModal.propTypes = {
  user: PropTypes.object,
  isBlocker: PropTypes.bool,
  onPress: PropTypes.func,
};

export default BlockerModal;
