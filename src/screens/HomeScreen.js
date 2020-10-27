import * as React from 'react';
import PropTypes from 'prop-types';
import { Text, View, ScrollView, RefreshControl, FlatList, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components/native';
import { path, pathOr, always } from 'ramda';
import dayjs from 'dayjs';

import IconListItem from 'components/IconListItem';
import ProfileCard from 'components/ProfileCard.js';
import {
  insFollowerCountSelector,
  insFollowingCountSelector,
  insPostCountSelector,
  insProfilePictureSelector,
  imNotFollowingBackCountSelector,
  notFollowingMeBackCountSelector,
  mutualFollowingCountSelector,
  newFollowersCountSelector,
  unFollowersCountSelector,
  blockerCountSelector,
  storyFeedSelector,
  ghostFollowerCountSelector,
  bestFollowerListCountSelector,
} from 'modules/instagram/selector';
import {
  fetchInsUserAllFollowing,
  fetchInsUserProfileAction,
  fetchInsUserAllFollower,
  fetchUserStoriesFeed,
} from 'modules/instagram/insAuthActions';
import { Avatar, AvatarImage } from 'components/AvatarImage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useCheckPremium } from 'modules/purchase/hook/useCheckPremium';
import i18n from 'i18n';
import { isExistUnSeenStory } from 'utils/instagram';
import { setJoinTimestamp } from 'actions/userActions';

const StyledView = styled(ScrollView).attrs(props => ({
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
}))`
  flex: 1;
`;

const IconListWithMargin = styled(IconListItem)`
  margin-top: ${pathOr(12, ['margin'])};
`;

const userDataSelector = createStructuredSelector({
  followers: insFollowerCountSelector,
  following: insFollowingCountSelector,
  posts: insPostCountSelector,
  profilePicture: insProfilePictureSelector,
  viewMyProfile: always(0),
  newFollowers: newFollowersCountSelector,
  unfollowers: unFollowersCountSelector,
  blockers: blockerCountSelector,
  notFollowingMeBack: notFollowingMeBackCountSelector,
  imNotFollowingBack: imNotFollowingBackCountSelector,
  mutualFollowing: mutualFollowingCountSelector,
  bestFollowers: bestFollowerListCountSelector,
  ghostFollowers: ghostFollowerCountSelector,
  storyFeed: storyFeedSelector,
});

const renderAvatarListItem = ({ item, index }, navigation, checkPremium) => {
  if (index === 0) {
    return <SearchAvatar navigation={navigation} checkPremium={checkPremium} />;
  }
  return (
    <AvatarWithUsername
      username={item?.user?.username}
      userPicture={{ uri: item?.user?.profile_pic_url }}
      isExistStory={isExistUnSeenStory(path(['seen']), path(['latest_reel_media']))(item)}
      onPress={checkPremium(() => navigation.navigate('story', { deckIndex: index - 1 }))}
    />
  );
};

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
    storyFeed,
  } = useSelector(userDataSelector);

  const [fetchingProgress, setFetchingProgress] = React.useState(0);
  const [showProgress, setShowProgress] = React.useState(false);

  const dispatch = useDispatch();
  const effectAction = async () => {
    setFetchingProgress(0);
    setShowProgress(true);
    await dispatch(fetchInsUserProfileAction());
    setFetchingProgress(0.25);
    await dispatch(fetchUserStoriesFeed());
    setFetchingProgress(0.5);
    await dispatch(fetchInsUserAllFollower());
    setFetchingProgress(0.75);
    await dispatch(fetchInsUserAllFollowing());
    setFetchingProgress(1);
    setTimeout(() => {
      setShowProgress(false);
    }, 1000);
    dispatch(setJoinTimestamp(dayjs().valueOf()));
  };
  React.useEffect(() => {
    effectAction();
  }, []);

  // const user = useSelector(state => state?.user);
  // require('utils/logUtils').default.log('CHUCK user', user);

  const [refreshing, setRefreshing] = React.useState(false);

  const { checkPremium } = useCheckPremium();

  const onRefresh = React.useCallback(() => {
    setRefreshing(false);
    effectAction();
    // setTimeout(() => {
    //   setRefreshing(false);
    // }, 500);
  }, []);

  return (
    <StyledView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={!showProgress} />
      }
    >
      <ProfileCard
        posts={posts}
        followers={followers}
        following={following}
        profilePicture={profilePicture}
        fetchingProgress={fetchingProgress}
        showProgress={showProgress}
      />
      {Platform.OS === 'android' && (
        <StoriesWrapper>
          <Title>{i18n.t('home_story_anonymously')}</Title>
          <AvatarsWrapper
            data={[
              1, // for search item
              ...storyFeed,
            ]}
            initialNumToRender={10}
            keyExtractor={(item, index) => pathOr(String(index), ['id'], item)}
            horizontal
            renderItem={item => renderAvatarListItem(item, navigation, checkPremium)}
          />
        </StoriesWrapper>
      )}
      <ListWrapper>
        <Title>{i18n.t('home_follower_status')}</Title>
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
          description={i18n.t('home_new_followers')}
          value={newFollowers}
          onPress={() => navigation.navigate('NewFollowers')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_unfollow.png')}
          description={i18n.t('home_unfollowers')}
          value={unfollowers}
          onPress={() => navigation.navigate('Unfollowers')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_block.png')}
          description={i18n.t('home_blocking_me')}
          value={blockers}
          onPress={checkPremium(() => navigation.navigate('SearchBlocker'))}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_notfollowingme.png')}
          description={i18n.t('home_not_following_back')}
          value={notFollowingMeBack}
          onPress={() => navigation.navigate('NotFollowingMeBack')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_idontfollowback.png')}
          description={i18n.t('home_im_not_following_back')}
          value={imNotFollowingBack}
          onPress={() => navigation.navigate('ImNotFollowingBack')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_mutual.png')}
          description={i18n.t('home_mutual_following')}
          value={mutualFollowing}
          onPress={() => navigation.navigate('MutualFollowing')}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_best.png')}
          description={i18n.t('home_best_followers')}
          value={bestFollowers}
          onPress={checkPremium(() => navigation.navigate('BestFollowers'))}
        />
        <IconListWithMargin
          iconSource={require('assets/icons/followstatus_ghost.png')}
          description={i18n.t('home_ghost_followers')}
          value={ghostFollowers}
          onPress={checkPremium(() => navigation.navigate('GhostFollowers'))}
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
  margin-top: 12;
  padding-bottom: 28%;
`;

const Title = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
`;

const StoriesWrapper = styled(View)`
  margin-top: 24;
`;

const AvatarsListWrapper = styled(View)`
  display: flex;
  flex-direction: row;
`;

const AvatarsWrapper = styled(FlatList).attrs(props => ({
  contentContainerStyle: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
}))`
  height: 100;
  flex: 1;
  margin-top: 6;
`;

const AvatarWithUsername = ({ username, userPicture, isExistStory, onPress }) => (
  <StyledAvatar onPress={onPress}>
    <Avatar isExistStory={isExistStory} source={userPicture} />
    <AvatarUsername ellipsizeMode="tail" numberOfLines={1}>
      @{username}
    </AvatarUsername>
  </StyledAvatar>
);

const StyledAvatar = styled(TouchableOpacity)`
  height: 100;
  width: 74;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SearchAvatarWrapper = styled(StyledAvatar)`
  flex: none;
`;

const AvatarUsername = styled(Text)`
  padding-top: 5;
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 12;
  text-align: center;
`;

const SearchAvatar = ({ navigation, following, checkPremium }) => (
  <SearchAvatarWrapper>
    <Background onPress={checkPremium(() => navigation.navigate('search'))}>
      <AvatarImage source={require('assets/icons/search.png')} roundedWidth={30} />
    </Background>
    <AvatarUsername />
  </SearchAvatarWrapper>
);

const Background = styled(TouchableOpacity)`
  width: 60;
  height: 60;
  border-radius: 30;
  align-items: center;
  justify-content: center;
  background-color: ${path(['theme', 'listItemBg'])};
`;
