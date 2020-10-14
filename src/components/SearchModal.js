// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { path, map, values } from 'ramda';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { isExist } from 'utils/ramdaUtils';

import Colors from 'constants/Colors';
import CancelButton from 'components/header/CancelButton';
import EmptyFoundView from 'components/EmptyFoundView';
import UserListItem from 'components/UserListItem';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SearchUserInput, { useSearchUserInput } from 'components/SearchUserInput';

const StyledView = styled(View)`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding-horizontal: 20;
`;

const Description = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
`;

const LocalUserListItem = ({ fullName, isPrivate, onPress, ...props }) => (
  <TouchableOpacity onPress={onPress}>
    <UserListItem
      {...props}
      buttonHide
      descriptionElement={<Description>{isPrivate ? 'The private account' : fullName}</Description>}
    />
  </TouchableOpacity>
);

LocalUserListItem.propTypes = {
  fullName: PropTypes.string,
  isPrivate: PropTypes.bool,
  onPress: PropTypes.func,
};

const SearchModal = ({ navigation }) => {
  React.useEffect(() => {
    navigation.setOptions({
      cardStyle: {
        backgroundColor: Colors.screenBackground,
      },
      title: 'Search Users',
      headerLeft: () => <CancelButton onPress={() => navigation.goBack()} />,
    });
  }, []);

  const {
    cleanSearchResult,
    searchResult,
    setSearchUserInput,
    isFocus: isSearchInputFocus,
    ...searchUserInputOpt
  } = useSearchUserInput(true, true);

  const inputEle = React.useRef(null);

  const onPress = user => async () => {
    if (user?.latest_reel_media === 0) {
      return;
    }
    inputEle.current.blur();

    setSearchUserInput(prev => ({
      ...prev,
      value: '',
    }));
    cleanSearchResult();
    const userId = String(user?.pk);
    const story = {
      [userId]: {
        idx: 0,
        id: userId,
        items: [],
      },
    };
    navigation.navigate('story', { story, deckIndex: 0, userId });
  };

  return (
    <StyledView>
      <SearchUserInput ref={inputEle} {...searchUserInputOpt} />
      {isExist(searchResult) ? (
        <View style={{ width: '100%', paddingTop: 10 }}>
          {map(user => (
            <LocalUserListItem
              username={user?.username}
              key={user.pk}
              profilePicture={user?.profile_pic_url}
              isPrivate={user?.is_private}
              isExistStory={user?.latest_reel_media !== 0}
              fullName={user?.full_name}
              isFollowing={user?.friendship_status?.following}
              onPress={onPress(user)}
            />
          ))(values(searchResult))}
        </View>
      ) : !searchUserInputOpt.value ? (
        <View></View>
      ) : (
            <EmptyFoundView />
          )}
    </StyledView>
  );
};

SearchModal.propTypes = {
  navigation: PropTypes.object,
};

export default SearchModal;
