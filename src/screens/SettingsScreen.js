import * as React from 'react';
import { ScrollView, Text, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { path, pathOr } from 'ramda';
import { createStructuredSelector } from 'reselect';
import * as MailComposer from 'expo-mail-composer';
import dedent from 'dedent';
import CookieManager from '@react-native-community/cookies';

import IconListItem from 'components/IconListItem';
import PromotionCard from 'components/PromotionCard.js';
import { getExpoBundleVersion } from 'utils/system';
import { logoutInsAction } from 'modules/instagram/insAuthActions';
import { IgUserNameContext } from 'modules/instagram/useCheckUserLoginIg';
import { checkSubscriptionStatus } from 'actions/userActions';
import { userSelector, isPremiumUserSelector } from 'modules/user/userSelector';
import { insUsernameSelector } from 'modules/instagram/selector';

const StyledView = styled(ScrollView).attrs(props => ({
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: props.theme.screenBackground,
    paddingBottom: 90,
  },
}))`
  flex: 1;
  background-color: ${path(['theme', 'screenBackground'])};
`;

const IconListWithMargin = styled(IconListItem)`
  margin-top: ${pathOr(12, ['margin'])};
`;

const selector = createStructuredSelector({
  user: userSelector,
  isPremium: isPremiumUserSelector,
  username: insUsernameSelector,
});

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { setUserName } = React.useContext(IgUserNameContext);
  const { isPremium, username, user } = useSelector(selector);
  return (
    <StyledView>
      {
        !isPremium &&
        <PromotionCard />
      }
      <IconListWithMargin
        margin={24}
        iconSource={require('assets/icons/settings_contactus.png')}
        description="Contact Us"
        onPress={() => {
          // TODO: CHUCK change the recipients and subject
          const options = {
            recipients: ['service.fypapp@gmail.com'],
            subject: 'Ins Master issue',
            body:
              '\n\n\n\n\n\n\n' +
              dedent`
                        ------ Don't delete infos below ------
                        user: ${user?.uid}
                        platform: ${user?.platform}
                        country: ${user?.countryCode}
                        username: ${username}
                        version: ${getExpoBundleVersion()}`,
          };
          MailComposer.composeAsync(options);
        }}
      />
      <IconListWithMargin
        iconSource={require('assets/icons/settings_restore.png')}
        description="Restore Purchase"
        onPress={async () => {
          dispatch(checkSubscriptionStatus());
        }}
      />
      {/* <IconListWithMargin
        iconSource={require('assets/icons/followstatus_best.png')}
        description="Rate Us"
      /> */}
      <IconListWithMargin
        iconSource={require('assets/icons/settings_termofuse.png')}
        description="Terms of Use"
        onPress={async () => {
          const url = 'https://www.generateprivacypolicy.com/live.php?token=FdpgJBqV5oaYbZm7xod9RfTkeEL6OKVS';
          const supported = await Linking.canOpenURL(url);
          if (supported) {
            Linking.openURL(url);
          }
        }}
      />
      <IconListWithMargin
        iconSource={require('assets/icons/settings_logour.png')}
        description="Log Out"
        onPress={() => {
          CookieManager.clearAll()
            .then((success) => {
              console.log('CookieManager.clearAll =>', success);
            });
          dispatch(logoutInsAction());
          setUserName(undefined);
        }}
      />
      <VersionText>Current version: {getExpoBundleVersion()}</VersionText>
    </StyledView>
  );
};

SettingsScreen.propTypes = {};

export default SettingsScreen;

const VersionText = styled(Text)`
  margin-top: 10px;
  color: ${path(['theme', 'primary', 'gray'])};
  align-self: center;
`;
