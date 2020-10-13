import * as React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { path, pathOr } from 'ramda';
import * as MailComposer from 'expo-mail-composer';
import dedent from 'dedent';
import Constants from 'expo-constants';

import IconListItem from 'components/IconListItem';
import PromotionCard from 'components/PromotionCard.js';
import i18n from 'i18n';

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

const SettingsScreen = () => (
  <StyledView>
    <PromotionCard />
    <IconListWithMargin
      margin={24}
      iconSource={require('assets/icons/settings_contactus.png')}
      description={i18n.t('settings_contact')}
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
      description={i18n.t('settings_restore')}
    />
    <IconListWithMargin
      iconSource={require('assets/icons/followstatus_best.png')}
      description={i18n.t('settings_rate')}
    />
    <IconListWithMargin
      iconSource={require('assets/icons/settings_termofuse.png')}
      description={i18n.t('settings_term_of_use')}
    />
    <IconListWithMargin
      iconSource={require('assets/icons/settings_logour.png')}
      description={i18n.t('settings_logout')}
    />
  </StyledView>
);

SettingsScreen.propTypes = {};

export default SettingsScreen;
