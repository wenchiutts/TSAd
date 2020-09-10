import * as React from 'react';
import { path } from 'ramda';
import { View, TextInput, ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';

import Colors from 'constants/Colors';
import SearchButton from 'components/SearchButton';
import EmptyFoundView from 'components/EmptyFoundView';
import UserListItem from 'components/UserListItem';

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
  border-radius: 8;
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

const Description = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
`;

const LocalUserListItem = ({ username, time }) => (
  <UserListItem
    username={username}
    buttonHide
    descriptionElement={<Description>Blocked you: {time}</Description>}
  />
);

const SearchBlockerScreen = () => {
  const [isEmpty, setIsEmpty] = React.useState(false);

  const onPress = () => {
    setIsEmpty(true);
  };

  const users = [
    {
      username: 'gordon',
      isFollower: true,
      isFollowing: true,
      time: 'Today',
    },
    {
      username: 'gordon',
      isFollower: true,
      isFollowing: false,
      time: 'Today',
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: true,
      time: '07-23-2020',
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: false,
      time: '07-23-2020',
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: true,
      time: '07-23-2020',
    },
    {
      username: 'gordon',
      isFollower: false,
      isFollowing: false,
      time: '07-23-2020',
    },
  ];

  return (
    <StyledView>
      <StyledInput>
        <SearchButton onPress={onPress} />
        <StyledTextInput
          placeholder="Search by username"
          placeholderTextColor={Colors.primary.lightBlue}
        />
      </StyledInput>
      {isEmpty ? (
        <EmptyFoundView />
      ) : (
        <ListWrapper>
          {users.map((user, index) => (
            <LocalUserListItem {...user} key={index} />
          ))}
        </ListWrapper>
      )}
    </StyledView>
  );
};

SearchBlockerScreen.propTypes = {};

export default SearchBlockerScreen;
