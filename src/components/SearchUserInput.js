//@format
import * as React from 'react';
import PropTypes from 'prop-types';
import { TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { is, path, compose, take, map } from 'ramda';

import { objFromListWith } from 'utils/ramdaUtils';
import Colors from 'constants/Colors';
import SearchButton from 'components/SearchButton';
import { searchUserAction } from 'modules/instagram/insAuthActions';

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

export const useSearchUserInput = includeReel => {
  const [searchResult, setSearchResult] = React.useState({});
  const tickingRef = React.useRef();
  const [inputState, setSearchUserInput] = React.useState({
    isFocus: false,
    value: '',
  });
  const dispatch = useDispatch();

  const onChangeText = text => {
    setSearchUserInput(prevState => ({ ...prevState, value: text }));

    if (!tickingRef.current) {
      window.requestAnimationFrame(async () => {
        try {
          const result = await dispatch(searchUserAction(text, includeReel));
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

  const onFocus = () => {
    setSearchUserInput(prevState => ({ ...prevState, isFocus: true }));
  };

  const onBlur = () => {
    setSearchUserInput(prevState => ({ ...prevState, isFocus: false }));
  };

  const cleanSearchResult = () => setSearchResult({});

  return {
    setSearchUserInput,
    searchResult,
    cleanSearchResult,
    ...inputState,
    onFocus,
    onChangeText,
    onBlur,
  };
};

const SearchUserInput = ({ onFocus, onChangeText, placeholder, onBlur, value, style }, ref) => (
  <StyledInput style={style}>
    <SearchButton />
    <StyledTextInput
      ref={ref}
      placeholder={placeholder || 'Search by username'}
      placeholderTextColor={Colors.primary.lightBlue}
      onFocus={onFocus}
      returnKeyType="search"
      onChangeText={onChangeText}
      onBlur={onBlur}
      value={value}
    />
  </StyledInput>
);

SearchUserInput.propTypes = {
  onFocus: PropTypes.func,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func,
  value: PropTypes.string,
  style: PropTypes.array,
};

export default React.forwardRef(SearchUserInput);
