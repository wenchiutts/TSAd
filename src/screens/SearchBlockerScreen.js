import * as React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { path, cond, compose, allPass, not, always, take, map, values } from 'ramda';
import {
  View,
  TextInput,
  ScrollView,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';

import Colors from 'constants/Colors';
import SearchButton from 'components/SearchButton';
import EmptyStatusView from 'components/EmptyStatusView';
import UserListItem from 'components/UserListItem';
import { checkBlockerAction, searchUserAction } from 'modules/instagram/insAuthActions';
import { isExist, objFromListWith, isNilOrEmpty } from 'utils/ramdaUtils';
import BlockerModal from 'components/BlockerModal';
import { blockerDataSelector } from 'modules/instagram/selector';
import Spinner from 'components/Spinner';

const StyledView = styled(View)`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding-top: 70;
  padding-horizontal: 20;
`;

const StyledInput = styled(View)`
  height: 48;
  width: 100%;
  border-top-right-radius: 8;
  border-top-left-radius: 8;
  border-bottom-right-radius: ${props => (props?.isShowList ? 0 : 8)};
  border-bottom-left-radius: ${props => (props?.isShowList ? 0 : 8)};
  background-color: ${path(['theme', 'primary', 'lightPurple'])};
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 16;
  margin-top: 10%;
`;

const StyledTextInput = styled(TextInput)`
  margin-left: 8;
  font-size: 14;
  color: ${path(['theme', 'noticeText'])};
  font-weight: 500;
`;

const ListWrapper = styled(ScrollView)`
  width: 100%;
  margin-top: 5%;
`;

const BlockerList = styled(FlatList)`
  width: 100%;
  margin-top: 5%;
`;

const BlockerListItem = ({ item }) => (
  <LocalUserListItem
    username={item?.profile?.username}
    key={item?.profile?.id}
    profilePicture={item?.profile?.profile_pic_url}
    timestamp={item.createdAt}
  />
);

const Description = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
`;

const StyledKeyboardAvoidingView = styled(KeyboardAvoidingView)`
  flex: 1;
  width: 100%;
  margin-bottom: 40;
  border-bottom-right-radius: 8;
  border-bottom-left-radius: 8;
  background-color: ${path(['theme', 'primary', 'lightPurple'])};
`;

const LocalUserListItem = ({ timestamp, ...rest }) => (
  <UserListItem
    {...rest}
    buttonHide
    descriptionElement={
      <Description>Blocked you: {new Date(timestamp).toLocaleDateString()}</Description>
    }
  />
);

LocalUserListItem.propTypes = {
  timestamp: PropTypes.number,
};

const StyledTouchableOpacity = styled(TouchableOpacity)`
  padding-horizontal: 10;
`;

const StyledUserListItem = styled(UserListItem)`
  margin-vertical: 10;
`;

const SearchResultListItem = ({ onPress, ...rest }) => (
  <StyledTouchableOpacity onPress={onPress}>
    <StyledUserListItem {...rest} />
  </StyledTouchableOpacity>
);

SearchResultListItem.propTypes = {
  onPress: PropTypes.func,
};

const selectors = createStructuredSelector({
  blockers: blockerDataSelector,
});

const SearchBlockerScreen = () => {
  const inputEle = React.useRef(null);
  const { blockers } = useSelector(selectors);
  const tickingRef = React.useRef();
  const [searchResult, setSearchResult] = React.useState({});
  const [inputState, setInputState] = React.useState({
    isFocus: false,
    text: '',
  });
  const [resultModal, setResultModal] = React.useState({
    isLoading: false,
    isShowing: false,
    isBlocker: false,
    user: undefined,
  });
  const dispatch = useDispatch();
  const isEmpty = isNilOrEmpty(blockers);

  const onFocus = () => {
    setInputState(prevState => ({ ...prevState, isFocus: true }));
  };

  const onBlur = () => {
    setInputState(prevState => ({ ...prevState, isFocus: false }));
  };

  const onChangeText = text => {
    setInputState(prevState => ({ ...prevState, text }));

    if (!tickingRef.current) {
      window.requestAnimationFrame(async () => {
        try {
          const result = await dispatch(searchUserAction(text));
          setSearchResult(
            compose(objFromListWith(path(['pk'])), map(path(['user'])), take(3))(result),
          );
          tickingRef.current = false;
        } catch (e) {
          setSearchResult([]);
        }
      });
      tickingRef.current = true;
    }
  };

  const onPress = user => async () => {
    setResultModal(prev => ({
      ...prev,
      isLoading: true,
    }));
    inputEle.current.blur();
    const result = await dispatch(checkBlockerAction(user));
    setInputState(prev => ({
      ...prev,
      text: '',
    }));
    setSearchResult({});
    setResultModal({
      isLoading: false,
      isShowing: true,
      isBlocker: result,
      user,
    });
  };

  const onRequestCloseModal = () => {
    setResultModal(prev => ({
      ...prev,
      isShowing: false,
    }));
  };

  return (
    <StyledView>
      {resultModal.isLoading && <Spinner />}
      <StyledInput isShowList={inputState.isFocus && isExist(searchResult)}>
        <SearchButton />
        <StyledTextInput
          ref={inputEle}
          placeholder="Search by username"
          placeholderTextColor={Colors.primary.lightBlue}
          onFocus={onFocus}
          returnKeyType="search"
          onChangeText={onChangeText}
          onBlur={onBlur}
          value={inputState.text}
        />
      </StyledInput>
      {cond([
        [
          allPass([path(['isFocus']), compose(isExist, path(['searchResult']))]),
          always(
            <StyledKeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <ListWrapper keyboardShouldPersistTaps="handled">
                {map(user => (
                  <SearchResultListItem
                    onPress={onPress(user)}
                    key={user.pk}
                    username={user?.username}
                    profilePicture={user?.profile_pic_url}
                    buttonHide
                    roundedWidth={45}
                  />
                ))(values(searchResult))}
              </ListWrapper>
            </StyledKeyboardAvoidingView>,
          ),
        ],
        [
          allPass([path(['isEmpty']), compose(not, path(['isFocus']))]),
          always(<EmptyStatusView text="blocker" />),
        ],
        [
          allPass([compose(not, path(['isFocus'])), compose(not, path(['isEmpty']))]),
          always(
            <BlockerList
              data={blockers}
              initialNumToRender={10}
              renderItem={BlockerListItem}
              keyExtractor={path(['id'])}
            />,
          ),
        ],
      ])({
        isFocus: inputState.isFocus,
        isEmpty,
        searchResult,
        blockers,
      })}
      <BlockerModal
        visible={resultModal.isShowing}
        user={resultModal.user}
        isBlocker={resultModal.isBlocker}
        onPress={onRequestCloseModal}
      />
    </StyledView>
  );
};

SearchBlockerScreen.propTypes = {};

export default SearchBlockerScreen;
