import { PLAN_TYPE } from 'components/ProductItem';

export const PRODUCTS_IDS = {
  PACKAGE_WEEKLY: 'com.ins.reports.analyzer.instagram.tracker.weekly',
  PACKAGE_MONTHLY: 'com.ins.reports.analyzer.instagram.tracker.monthly',
  PACKAGE_ANNUALY: 'com.ins.reports.analyzer.instagram.tracker.annualy',
};

export const PRODUCT_PLAN_TYPE_MAP = {
  'Annually pass': PLAN_TYPE.YEAR,
  'Monthly pass': PLAN_TYPE.MONTH,
  'Weekly pass': PLAN_TYPE.WEEK,
};
