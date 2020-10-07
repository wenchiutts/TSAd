import { PLAN_TYPE } from 'components/ProductItem';

export const PRODUCTS_IDS = {
  PACKAGE_WEEKLY: 'com.ins.reports.analyzer.insta.followers.tracker.weekly',
  PACKAGE_MONTHLY: 'com.ins.reports.analyzer.insta.followers.tracker.monthly',
  PACKAGE_ANNUALY: 'com.ins.reports.analyzer.insta.followers.tracker.annualy',
};

export const PRODUCT_PLAN_TYPE_MAP = {
  'Annually pass': PLAN_TYPE.YEAR,
  'Monthly pass': PLAN_TYPE.MONTH,
  'Weekly pass': PLAN_TYPE.WEEK,
};

export const IAP_PRODUCTS = {
  [PRODUCTS_IDS.PACKAGE_WEEKLY]: {
    periodDays: 7,
  },
  [PRODUCTS_IDS.PACKAGE_MONTHLY]: {
    periodDays: 31,
  },
  [PRODUCTS_IDS.PACKAGE_ANNUALY]: {
    periodDays: 365,
  }
};
