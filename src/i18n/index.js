import i18n from 'i18n-js';
import { NativeModules, Platform } from 'react-native';

const en = require('./dict/en.json');

let deviceLanguage = 'en-US';
if (Platform.OS === 'android') {
  deviceLanguage = NativeModules.I18nManager?.localeIdentifier;
} else if (Platform.OS === 'ios') {
  deviceLanguage =
    NativeModules.SettingsManager?.settings?.AppleLocale ||
    NativeModules.SettingsManager?.settings?.AppleLanguages[0];
}

i18n.locale = deviceLanguage.replace('_', '-');
i18n.fallbacks = true;
i18n.translations = {
  en,
};

export default i18n;
