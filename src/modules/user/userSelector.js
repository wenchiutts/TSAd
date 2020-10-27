// @format
import { createSelector } from 'reselect';
import { path, equals } from 'ramda';

export const userSelector = path(['user']);

export const hasLaunchedSelector = createSelector(userSelector, path(['hasLaunched']));

export const joinTimestampSelector = createSelector(userSelector, path(['joinTimestamp']));

export const userLaunchTimesSelector = createSelector(userSelector, path(['launchTimes']));

export const userPremiumSelector = createSelector(userSelector, path(['premium']));

export const userPremiumStatusSelector = createSelector(userPremiumSelector, path(['status']));

export const isPremiumUserSelector = createSelector(userPremiumStatusSelector, equals('active'));
