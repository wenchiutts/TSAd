import { PLAN_TYPE } from 'components/ProductItem';

export const PRODUCTS_IDS = {
  PACKAGE_WEEKLY: 'com.ins.reports.analyzer.insta.followers.tracker.weekly',
  PACKAGE_MONTHLY: 'com.ins.reports.analyzer.insta.followers.tracker.monthly',
  PACKAGE_ANNUALLY: 'com.ins.reports.analyzer.insta.followers.tracker.annually',
};

export const PRODUCT_PLAN_TYPE_MAP = {
  [PRODUCTS_IDS.PACKAGE_WEEKLY]: PLAN_TYPE.WEEK,
  [PRODUCTS_IDS.PACKAGE_MONTHLY]: PLAN_TYPE.MONTH,
  [PRODUCTS_IDS.PACKAGE_ANNUALLY]: PLAN_TYPE.YEAR,
};

export const IAP_PRODUCTS = {
  [PRODUCTS_IDS.PACKAGE_WEEKLY]: {
    periodDays: 7,
  },
  [PRODUCTS_IDS.PACKAGE_MONTHLY]: {
    periodDays: 31,
  },
  [PRODUCTS_IDS.PACKAGE_ANNUALLY]: {
    periodDays: 365,
  }
};
