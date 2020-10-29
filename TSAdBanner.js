import * as React from 'react';
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

import Colors from 'modules/Ads/constants/Colors';

// TS = TouShih ad banner
const TSAdBanner = ({
  style = {},
  iconSource,
  title = 'Reports for Instagram',
  subtitle = 'Ins Master 🚀',
  linkUrl,
}) => {
  return (
    <Container
      style={style}
      onPress={async () => {
        const supported = Linking.canOpenURL(linkUrl);
        if (supported) {
          Linking.openURL(linkUrl);
        }
      }}
    >
      <IconImage source={iconSource} />
      <TextArea
        style={{
          marginLeft: 12,
          width: '60%',
          maxWidth: '60%',
        }}
        title={title}
        subtitle={subtitle}
      />
      <ActionButton source={require('modules/Ads/assets/download.png')} />
      <AdText>Ad Sponsored</AdText>
    </Container>
  );
};

export default TSAdBanner;

const Container = styled(TouchableOpacity)`
  width: 100%;
  height: 66;
  border-radius: 12;
  background-color: ${Colors.lightBlue};
  padding-left: 12;
  padding-right: 12;
  padding-top: 19;
  padding-bottom: 19;
  flex-direction: row;
  align-items: center;
`;

const IconImage = styled(Image)`
  width: 49;
  height: 49;
  background-color: #000000;
  border-radius: 10;
`;

const Title = styled(Text)`
  font-size: 14;
  color: ${Colors.screenBackground};
`;

const SubTitle = styled(Text)`
  font-weight: bold;
  font-size: 14;
  color: ${Colors.screenBackground};
`;

const TextArea = ({ style = {}, title, subtitle }) => {
  return (
    <View
      style={{
        ...style,
      }}
    >
      <Title numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Title>
      <SubTitle numberOfLines={1} ellipsizeMode="tail">
        {subtitle}
      </SubTitle>
    </View>
  );
};

const ActionButton = styled(Image)`
  width: 48;
  height: 48;
  border-radius: 24;
  background-color: #000000;
`;

const AdText = styled(Text)`
  color: ${Colors.gray};
  position: absolute;
  top: -1;
  right: 10;
  font-size: 7;
`;
