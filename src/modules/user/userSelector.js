// @format
import { createSelector } from 'reselect';
import { path, equals } from 'ramda';

export const userSelector = path(['user']);

export const userPremiumSelector = createSelector(userSelector, path(['premium']));

export const userPremiumStatusSelector = createSelector(userPremiumSelector, path(['status']));

export const isPremiumUserSelector = createSelector(userPremiumStatusSelector, equals('active'));
