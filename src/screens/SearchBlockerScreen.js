import * as React from 'react';
import { path } from 'ramda';
import { View, Dimensions, TextInput } from 'react-native';
import styled from 'styled-components/native';

import Colors from 'constants/Colors';
import BackButton from 'components/header/BackButton';
import SearchButton from 'components/SearchButton';
import EmptyFoundView from 'components/EmptyFoundView';

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

const SearchBlockerScreen = ({ navigation }) => {
  const [isEmpty, setIsEmpty] = React.useState(false);
  navigation.setOptions({
    cardStyle: {
      backgroundColor: Colors.screenBackground,
    },
    title: 'Search Blockers',
    headerLeft: () => <BackButton />,
  });

  const onPress = () => {
    setIsEmpty(true);
  };
  return (
    <StyledView>
      <StyledInput>
        <SearchButton onPress={onPress} />
        <StyledTextInput
          placeholder="Search by username"
          placeholderTextColor={Colors.primary.lightBlue}
        />
      </StyledInput>
      {isEmpty ? <EmptyFoundView /> : <View></View>}
    </StyledView>
  );
};

SearchBlockerScreen.propTypes = {};

export default SearchBlockerScreen;
