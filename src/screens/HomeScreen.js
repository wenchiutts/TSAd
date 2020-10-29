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
  insUsernameSelector,
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
import apis from 'apis';
import { mapIndexed } from 'utils/ramdaUtils';

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
  username: insUsernameSelector,
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
      onPress={() => avatarOnpress(index, checkPremium, navigation)}
    />
  );
};

const logEvent = route => apis.firebase.logEvent({ name: `onPress_home_${route}` });

const avatarOnpress = (index, checkPremium, navigation) => {
  const premium = checkPremium(() => navigation.navigate('story', { deckIndex: index - 1 }));
  premium();
  logEvent('avatar');
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
    username,
  } = useSelector(userDataSelector);

  const iconList = [
    {
      iconSource: require('assets/icons/followstatus_newfollow.png'),
      description: i18n.t('home_new_followers'),
      route: 'NewFollowers',
      value: newFollowers,
    },
    {
      iconSource: require('assets/icons/followstatus_unfollow.png'),
      description: i18n.t('home_unfollowers'),
      route: 'Unfollowers',
      value: unfollowers,
    },
    {
      iconSource: require('assets/icons/followstatus_block.png'),
      description: i18n.t('home_blocking_me'),
      route: 'SearchBlocker',
      value: blockers,
    },
    {
      iconSource: require('assets/icons/followstatus_notfollowingme.png'),
      description: i18n.t('home_not_following_back'),
      route: 'NotFollowingMeBack',
      value: notFollowingMeBack,
    },
    {
      iconSource: require('assets/icons/followstatus_idontfollowback.png'),
      description: i18n.t('home_im_not_following_back'),
      route: 'ImNotFollowingBack',
      value: imNotFollowingBack,
    },
    {
      iconSource: require('assets/icons/followstatus_mutual.png'),
      description: i18n.t('home_mutual_following'),
      route: 'MutualFollowing',
      value: mutualFollowing,
    },
    {
      iconSource: require('assets/icons/followstatus_best.png'),
      description: i18n.t('home_best_followers'),
      route: 'BestFollowers',
      value: bestFollowers,
    },
    {
      iconSource: require('assets/icons/followstatus_ghost.png'),
      description: i18n.t('home_ghost_followers'),
      route: 'GhostFollowers',
      value: ghostFollowers,
    },
  ];

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
    navigation.setOptions({
      title: `@${username}`,
    });
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

  const onPress = item => {
    const premium = checkPremium(() => item.route && navigation.navigate(item.route));
    premium();
    logEvent(item.route);
  };

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

        {mapIndexed((item, idx) => (
          <IconListWithMargin key={idx} {...item} onPress={() => onPress(item)} />
        ))(iconList)}
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

const SearchAvatar = ({ navigation, following, checkPremium }) => {
  const localOnpress = () => {
    const premium = checkPremium(() => navigation.navigate('search'));
    premium();
    logEvent('SearchUser');
  };
  return (
    <SearchAvatarWrapper>
      <Background onPress={() => localOnpress()}>
        <AvatarImage source={require('assets/icons/search.png')} roundedWidth={30} />
      </Background>
      <AvatarUsername />
    </SearchAvatarWrapper>
  );
};

const Background = styled(TouchableOpacity)`
  width: 60;
  height: 60;
  border-radius: 30;
  align-items: center;
  justify-content: center;
  background-color: ${path(['theme', 'listItemBg'])};
`;
