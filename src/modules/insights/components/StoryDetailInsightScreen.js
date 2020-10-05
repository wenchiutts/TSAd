// @format
import * as React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { View, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { createSelector } from 'reselect';
import { compose, path, pathEq, find, tap } from 'ramda';

import DEBUG from 'utils/logUtils';
import {
  archivesListSelector,
  storyViewersListByStoryIdSelector,
} from 'modules/instagram/selector';
import StoryGridItem from 'modules/insights/components/StoryGridItem';
import UserListItem from 'components/UserListItem';

const selectStoryById = createSelector(
  archivesListSelector,
  (__, storyId) => storyId,
  (archives, storyId) => find(pathEq(['id'], storyId), archives),
);

const StyledView = styled(FlatList).attrs(props => ({
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
  },
  ListHeaderComponentStyle: {
    width: '100%',
  },
}))`
  flex: 1;
  background-color: ${path(['theme', 'screenBackground'])};
`;

const StyledStoryItem = styled(StoryGridItem)`
  width: 66;
  height: 117.5;
  border-radius: 4;
  overflow: hidden;
`;

const StoryWrapper = styled(View)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16;
  padding-bottom: 20;
  background-color: #6236ff;
`;

const StyledUserListItem = styled(UserListItem)`
  margin-vertical: 0;
  background-color: ${path(['theme', 'screenBackground'])};
  padding-vertical: 22;
  padding-horizontal: 12;
`;

const ListItem = ({ item }) => (
  <StyledUserListItem
    username={path(['username'], item)}
    profilePicture={path(['profile_pic_url'], item)}
    userId={compose(String, path(['pk']))(item)}
    isFollowing={path(['friendship_status', 'following'], item)}
    roundedWidth={60}
  />
);

const StoryDetailInsightScreen = ({ route }) => {
  const { storyId } = route.params;
  const story = useSelector(state => selectStoryById(state, storyId));
  const viewers = useSelector(state => storyViewersListByStoryIdSelector(state, storyId));
  return (
    <StyledView
      ListHeaderComponent={
        <StoryWrapper>
          <StyledStoryItem
            storyId={compose(String, path(['id']))(story)}
            imgSrc={path(['image_versions2', 'candidates', 3, 'url'], story)}
            viewsCount={path(['total_viewer_count'], story)}
          />
        </StoryWrapper>
      }
      data={viewers}
      renderItem={ListItem}
      initialNumToRender={10}
      keyExtractor={compose(String, path(['pk']))}
    />
  );
};

StoryDetailInsightScreen.propTypes = {
  route: PropTypes.object,
};

export default StoryDetailInsightScreen;
