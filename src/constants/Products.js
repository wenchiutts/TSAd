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
    periodMonth: 0.25,
    bgColors: ['#32C5FF', '#0091FF'],
    icon: require('assets/icons/pro_plan3.png'),
    title: '1 Week',
  },
  [PRODUCTS_IDS.PACKAGE_MONTHLY]: {
    periodDays: 31,
    periodMonth: 1,
    bgColors: ['#44D7B6', '#32C5FF'],
    icon: require('assets/icons/pro_plan2.png'),
    title: '1 Month',
    discount: '40%',
  },
  [PRODUCTS_IDS.PACKAGE_ANNUALLY]: {
    periodDays: 365,
    periodMonth: 12,
    bgColors: ['#FEA15A', '#FC5C7B'],
    icon: require('assets/icons/pro_plan1.png'),
    title: '1 Year',
    discount: '80%',
  }
};
