// @format
import * as React from 'react';
import { path, map, values } from 'ramda';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { useDispatch } from 'react-redux';

import Colors from 'constants/Colors';
import CancelButton from 'components/header/CancelButton';
import EmptyFoundView from 'components/EmptyFoundView';
import UserListItem from 'components/UserListItem';
import apis from 'apis';
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

const SearchModal = ({ navigation }) => {
  navigation.setOptions({
    cardStyle: {
      backgroundColor: Colors.screenBackground,
    },
    title: 'Search Users',
    headerLeft: () => <CancelButton onPress={() => navigation.goBack()} />,
  });

  const {
    cleanSearchResult,
    searchResult,
    setSearchUserInput,
    isFocus: isSearchInputFocus,
    ...searchUserInputOpt
  } = useSearchUserInput(true, true);

  console.log('searchUserInputOpt', searchUserInputOpt, 'searchResult', searchResult);

  const inputEle = React.useRef(null);
  const [resultStories, setResultStories] = React.useState([]);

  const dispatch = useDispatch();

  const onPress = user => async () => {
    if (user?.latest_reel_media === 0) {
      return;
    }
    inputEle.current.blur();

    const userStory = await apis.instagram.getStoryDetails({
      reelIds: user?.pk,
    });
    setSearchUserInput(prev => ({
      ...prev,
      value: '',
    }));
    cleanSearchResult();
    console.log(userStory[0].items);
  };

  return (
    <StyledView>
      <SearchUserInput ref={inputEle} {...searchUserInputOpt} />
      {Object.keys(searchResult).length !== 0 ? (
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
export default SearchModal;
