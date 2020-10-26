import * as React from 'react';
import * as Progress from 'react-native-progress';

import Colors from 'constants/Colors';

const ProgressCircle = ({ style, fetchingProgress, size }) => {
  return (
    <>
      <Progress.Circle
        size={size + 8}
        showsText={true}
        borderWidth={0}
        style={style}
        color={Colors.primary.purple}
        unfilledColor={'rgba(242, 242, 242, 0.5)'}
        progress={fetchingProgress}
        thickness={8}
        textStyle={{
          color: Colors.primary.lightBlue,
          fontWeight: 'bold',
          fontSize: 16,
        }}
        fill={'rgba(0, 0, 0, 0.25)'}
        strokeCap={'round'}
      />
    </>
  );
};

export default ProgressCircle;
