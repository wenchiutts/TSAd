import * as React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { path, pathOr } from 'ramda';
import * as MailComposer from 'expo-mail-composer';
import dedent from 'dedent';
import Constants from 'expo-constants';

import IconListItem from 'components/IconListItem';

import PromotionCard from 'components/PromotionCard.js';

const StyledView = styled(View)`
  flex: 1;
  justify-content: flex-start;
  padding-horizontal: 20;
  padding-top: 25%;
  background-color: ${path(['theme', 'screenBackground'])};
`;

const IconListWithMargin = styled(IconListItem)`
  margin-top: ${pathOr(12, ['margin'])};
`;

const SettingsScreen = () => (
  <StyledView>
    <PromotionCard />
    <IconListWithMargin
      margin={24}
      iconSource={require('assets/icons/settings_contactus.png')}
      description="Contact Us"
      onPress={() => {
        // TODO: CHUCK change the recipients and subject
        const options = {
          recipients: ['tikfansapp@gmail.com'],
          subject: 'TikFans issue',
          body:
            '\n\n\n\n\n\n\n' +
            dedent`
                        ------ Don't delete infos below ------
                        user: $user?.uid
                        platform: $user?.platform
                        country: $user?.countryCode
                        uniqueId: $user?.tiktok?.uniqueId
                        version: ${
                          process.env?.APP_MANIFEST?.version || Constants.manifest.version
                        }`,
        };
        MailComposer.composeAsync(options);
      }}
    />
    <IconListWithMargin
      iconSource={require('assets/icons/settings_restore.png')}
      description="Restore Purchase"
    />
    <IconListWithMargin
      iconSource={require('assets/icons/followstatus_best.png')}
      description="Rate Us"
    />
    <IconListWithMargin
      iconSource={require('assets/icons/settings_termofuse.png')}
      description="Term os Use"
    />
    <IconListWithMargin
      iconSource={require('assets/icons/settings_logour.png')}
      description="Log Out"
    />
  </StyledView>
);

SettingsScreen.propTypes = {};

export default SettingsScreen;
