// @format
import * as React from 'react';
import { path } from 'ramda';
import { View, TextInput, Dimensions, Image, Text } from 'react-native';
import styled from 'styled-components/native';
import { useDispatch } from 'react-redux';

import Colors from 'constants/Colors';
import CancelButton from 'components/header/CancelButton';
import SearchButton from 'components/SearchButton';
import EmptyFoundView from 'components/EmptyFoundView';
import { searchUserAction, fetchInsUserPublicAction } from 'modules/instagram/insAuthActions';
import UserListItem from 'components/UserListItem';
import apis from 'apis';

const { width: screenWidth } = Dimensions.get('window');

const StyledView = styled(View)`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding-top: 70;
`;

const StyledInput = styled(View)`
  height: 48;
  width: ${screenWidth - 40};
  border-radius: 8;
  background-color: ${path(['theme', 'primary', 'lightPurple'])};
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 16;
  margin-vertical: 30;
`;

const StyledTextInput = styled(TextInput)`
  margin-left: 8;
  font-size: 14;
  color: ${path(['theme', 'noticeText'])};
  font-weight: 500;
`;

const Description = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
`;

const LocalUserListItem = ({ item, isExistStory, storyCount, isPrivate }) => (
  <UserListItem
    style={{ paddingLeft: 20 }}
    username={item?.user?.username}
    profilePicture={item?.user?.profile_pic_url}
    buttonHide
    isExistStory={isExistStory}
    descriptionElement={
      <Description>
        {isPrivate
          ? 'The private account'
          : `${storyCount} ${storyCount <= 1 ? 'story' : 'stories'}`}
      </Description>
    }
  />
);

const SearchModal = ({ navigation }) => {
  navigation.setOptions({
    cardStyle: {
      backgroundColor: Colors.screenBackground,
    },
    title: 'Search Users',
    headerLeft: () => <CancelButton onPress={() => navigation.goBack()} />,
  });

  const [isEmpty, setIsEmpty] = React.useState(false);
  const [isSearched, setIsSearched] = React.useState(false);
  const [inputText, setInputText] = React.useState('');
  const [targetUser, setTargetUser] = React.useState('');
  const [isExistStory, setIsExistStory] = React.useState(false);
  const [storyCount, setStoryCount] = React.useState(0);
  const [isPrivate, setIsPrivate] = React.useState(false);

  const inputEle = React.useRef(null);

  const dispatch = useDispatch();

  const onChangeText = text => {
    setInputText(text);
  };

  const onPress = async () => {
    inputEle.current.blur();
    setIsSearched(true);
    setIsPrivate(false);
    const result = await dispatch(searchUserAction(inputText));
    const targetUser = result.filter(item => item?.user?.username === inputText);
    const userStory = await apis.instagram.getStoryDetails({
      reelIds: targetUser[0]?.user?.pk,
    });
    if (targetUser[0]?.user?.is_private) {
      setIsPrivate(true);
    }
    setIsExistStory(userStory.length !== 0);
    if (userStory.length !== 0) {
      setStoryCount(userStory[0].items.length);
    }
    if (targetUser.length === 0) {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
      setTargetUser(targetUser[0]);
    }
    setInputText('');
  };

  return (
    <StyledView>
      <StyledInput>
        <SearchButton onPress={onPress} />
        <StyledTextInput
          ref={inputEle}
          value={inputText}
          onChangeText={onChangeText}
          placeholder="Search by username"
          placeholderTextColor={Colors.primary.lightBlue}
        />
      </StyledInput>
      {isSearched ? (
        isEmpty ? (
          <EmptyFoundView />
        ) : (
          <LocalUserListItem
            item={targetUser}
            isExistStory={isExistStory}
            storyCount={storyCount}
            isPrivate={isPrivate}
          />
        )
      ) : (
        <View></View>
      )}
    </StyledView>
  );
};
export default SearchModal;
