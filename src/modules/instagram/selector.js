// @format
import { path } from 'ramda';
import { createSelector } from 'reselect';

const instagramSelector = path(['instagram']);

export const isFetchingInstagramSelector = createSelector(instagramSelector, path(['isFetching']));

export const insCookieSelector = createSelector(instagramSelector, path(['cookies']));

export const insProfileSelector = createSelector(instagramSelector, path(['profile']));

export const insFollowingCountSelector = createSelector(
  insProfileSelector,
  path(['followingCount']),
);

export const insFollowerCountSelector = createSelector(insProfileSelector, path(['followerCount']));

export const insProfilePictureSelector = createSelector(insProfileSelector, path(['profilePicHd']));
