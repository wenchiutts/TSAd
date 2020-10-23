import * as React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { path, cond, compose, allPass, not, always, map, values } from 'ramda';
import {
  View,
  ScrollView,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';

import EmptyStatusView from 'components/EmptyStatusView';
import SearchingGuideView from 'components/SearchingGuideView';
import UserListItem from 'components/UserListItem';
import { checkBlockerAction } from 'modules/instagram/insAuthActions';
import { isExist, isNilOrEmpty } from 'utils/ramdaUtils';
import BlockerModal from 'components/BlockerModal';
import { blockerDataSelector } from 'modules/instagram/selector';
import Spinner from 'components/Spinner';
import SearchUserInput, { useSearchUserInput } from 'components/SearchUserInput';

const StyledView = styled(View)`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding-horizontal: 20;
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

const StyledSearchUserInput = styled(SearchUserInput)`
  border-bottom-right-radius: ${props => (props?.isShowList ? 0 : 8)};
  border-bottom-left-radius: ${props => (props?.isShowList ? 0 : 8)};
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
  const {
    cleanSearchResult,
    searchResult,
    setSearchUserInput,
    isFocus: isSearchInputFocus,
    ...searchUserInputOpt
  } = useSearchUserInput();
  const inputEle = React.useRef(null);
  const { blockers } = useSelector(selectors);
  const [resultModal, setResultModal] = React.useState({
    isLoading: false,
    isShowing: false,
    isBlocker: false,
    user: undefined,
  });
  const dispatch = useDispatch();
  const isEmpty = isNilOrEmpty(blockers);

  const onPress = user => async () => {
    setResultModal(prev => ({
      ...prev,
      isLoading: true,
    }));
    inputEle.current.blur();
    const result = await dispatch(checkBlockerAction(user));
    setSearchUserInput(prev => ({
      ...prev,
      value: '',
    }));
    cleanSearchResult();
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
      <StyledSearchUserInput
        ref={inputEle}
        {...searchUserInputOpt}
        isShowList={isSearchInputFocus && isExist(searchResult)}
      />
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
          allPass([
            compose(not, path(['isFocus'])),
            compose(isNilOrEmpty, path(['searchUserInputOpt', 'value'])),
          ]),
          always(<SearchingGuideView />),
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
        isFocus: isSearchInputFocus,
        isEmpty,
        searchResult,
        blockers,
        searchUserInputOpt,
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
