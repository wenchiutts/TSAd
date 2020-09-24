// @format
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import Colors from 'constants/Colors';

const Spinner = styled(ActivityIndicator).attrs({
  size: 'large',
  color: Colors.primary.lightPurple,
})`
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 99;
`;

export default Spinner;
