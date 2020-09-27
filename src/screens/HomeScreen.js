import * as React from 'react';
import PropTypes from 'prop-types';
import { Text, View, ScrollView, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components/native';
import { path, pathOr, always } from 'ramda';

import IconListItem from 'components/IconListItem';
import ProfileCard from 'components/ProfileCard.js';
import {
  insFollowersCountSelector,
  insFollowingsCountSelector,
  insPostCountSelector,
  insProfilePictureSelector,
  imNotFollowingBackCountSelector,
  notFollowingMeBackCountSelector,
  mutualFollowingCountSelector,
  newFollowersCountSelector,
  unFollowersCountSelector,
  blockerCountSelector,
} from 'modules/instagram/selector';
import {
  fetchInsUserAllFollowing,
  fetchInsUserProfileAction,
  fetchInsUserAllFollower,
} from 'modules/instagram/insAuthActions';

const StyledView = styled(ScrollView).attrs(props => ({
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingTop: '25%',
  },
}))`
  flex: 1;
`;

const IconListWithMargin = styled(IconListItem)`
  margin-top: ${pathOr(12, ['margin'])};
`;

const userDataSelector = createStructuredSelector({
  followers: insFollowersCountSelector,
  following: insFollowingsCountSelector,
  posts: insPostCountSelector,
  profilePicture: insProfilePictureSelector,
  viewMyProfile: always(0),
  newFollowers: newFollowersCountSelector,
  unfollowers: unFollowersCountSelector,
  blockers: blockerCountSelector,
  notFollowingMeBack: notFollowingMeBackCountSelector,
  imNotFollowingBack: imNotFollowingBackCountSelector,
  mutualFollowing: mutualFollowingCountSelector,
  bestFollowers: always(0),
  ghostFollowers: always(0),
});

const HomeScreen = ({ navigation }) => {
  const {
    posts,
    followers,
    following,
    profilePicture,
    viewMyProfile,
    newFollowers,
    unfollowers,
    blockers,
    notFollowingMeBack,
    imNotFollowingBack,
    mutualFollowing,
    bestFollowers,
    ghostFollowers,
  } = useSelector(userDataSelector);

  const dispatch = useDispatch();
  const effectAction = async () => {
    await dispatch(fetchInsUserProfileAction());
    await dispatch(fetchInsUserAllFollowing());
    await dispatch(fetchInsUserAllFollower());
  };
  React.useEffect(() => {
    effectAction();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    effectAction();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  return (
    <StyledView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <ProfileCard
        posts={posts}
        followers={followers}
        following={following}
        profilePicture={profilePicture}
      />
      <ListWrapper>
        <Title>Follower Status</Title>
        {/*
        <IconListWithMargin
          margin={18}
          iconSource={require('assets/icons/followstatus_visit_small.png')}
          description="Who viewed my profile"
          value={viewMyProfile}
          onPress={() => navigation.navigate('ViewMyProfile')}
        />
        */}
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_newfollow.png')}
          description="New followers"
          value={newFollowers}
          onPress={() => navigation.navigate('NewFollowers')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_unfollow.png')}
          description="Unfollowers"
          value={unfollowers}
          onPress={() => navigation.navigate('Unfollowers')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_block.png')}
          description="Who blocking me"
          value={blockers}
          onPress={() => navigation.navigate('SearchBlocker')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_notfollowingme.png')}
          description="Not following me back"
          value={notFollowingMeBack}
          onPress={() => navigation.navigate('NotFollowingMeBack')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_idontfollowback.png')}
          description={`I'm Not following back`}
          value={imNotFollowingBack}
          onPress={() => navigation.navigate('ImNotFollowingBack')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_mutual.png')}
          description="Mutual following"
          value={mutualFollowing}
          onPress={() => navigation.navigate('MutualFollowing')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_best.png')}
          description="Best followers"
          value={bestFollowers}
          onPress={() => navigation.navigate('BestFollowers')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_ghost.png')}
          description="Ghost followers"
          value={ghostFollowers}
          onPress={() => navigation.navigate('GhostFollowers')}
        />
      </ListWrapper>
    </StyledView>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.object,
};

export default HomeScreen;

const ListWrapper = styled(View)`
  margin-top: 24;
  padding-bottom: 28%;
`;

const Title = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
`;
