// @format
import styled from 'styled-components/native';
import { compose, applySpec, prop, ifElse, not } from 'ramda';
import { setPropTypes, withProps, branch } from 'recompose';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

import { omitProps } from 'utils/recomposeUtils';
import { isExist } from 'utils/ramdaUtils';

const StyledImage = styled(Image)`
  height: 48px;
  width: 48px;
`;

export default compose(
  setPropTypes({
    // activeImg: PropTypes.number.isRequired,
    // inActiveImg: PropTypes.number,
  }),
  branch(
    compose(not, isExist, prop('inActiveImg')),
    withProps(
      applySpec({
        inActiveImg: prop('activeImg'),
      }),
    ),
  ),
  withProps(
    applySpec({
      source: ifElse(prop('focused'), prop('activeImg'), prop('inActiveImg')),
    }),
  ),
  omitProps(['activeImg', 'inActiveImg', 'focused']),
  // setPropTypes({
  //   source: PropTypes.number,
  // }),
)(StyledImage);
