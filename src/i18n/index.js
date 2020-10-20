import i18n from 'i18n-js';
import { NativeModules, Platform } from 'react-native';

const en = require('./dict/en.json');
const ar = require('./dict/ar.json');
const de = require('./dict/de.json');
const es = require('./dict/es.json');
const fr = require('./dict/fr.json');
const id = require('./dict/id.json');
const ja = require('./dict/ja.json');
const ko = require('./dict/ko.json');
const pt = require('./dict/pt.json');
const ru = require('./dict/ru.json');
const th = require('./dict/th.json');
const tr = require('./dict/tr.json');
const zh = require('./dict/zh.json');
const vi = require('./dict/vi.json');
const it = require('./dict/it.json');
const pl = require('./dict/pl.json');
const fa = require('./dict/fa.json');

let deviceLanguage = 'en-US';
if (  Platform.OS === 'android') {
  deviceLanguage = NativeModules.I18nManager?.localeIdentifier;
} else if (Platform.OS === 'ios') {
  deviceLanguage =
    NativeModules.SettingsManager?.settings?.AppleLocale ||
    NativeModules.SettingsManager?.settings?.AppleLanguages[0];
}

i18n.locale = deviceLanguage.replace('_', '-');
i18n.fallbacks = true;
i18n.translations = {
  ar, 
  de, 
  en, 
  es,
  fr,
  id,
  ja,
  ko,
  pt,
  ru,
  th,
  tr,
  zh,
  vi,
  it,
  pl,
  fa
};

export default i18n;
