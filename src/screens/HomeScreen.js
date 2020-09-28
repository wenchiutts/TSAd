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
import { Avatar, AvatarImage } from 'components/AvatarImage';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
      <StoriesWrapper>
        <Title>Watch Stories Anonymously</Title>
        <AvatarsWrapper horizontal>
          <SearchAvatar navigation={navigation} />
          <AvatarWithUsername
            username="kai_hello"
            isExistStory
            onPress={() => navigation.navigate('story', { deckIndex: 0 })}
          />
          <AvatarWithUsername username="kai_hello" />
          <AvatarWithUsername
            username="kai_hello"
            isExistStory
            onPress={() => navigation.navigate('story', { deckIndex: 2 })}
          />
          <AvatarWithUsername username="kai_hello" />
          <AvatarWithUsername username="kai_hello" />
          <AvatarWithUsername username="kai_hello" />
          <AvatarWithUsername username="kai_hello" />
          <AvatarWithUsername username="kai_hello" />
          <AvatarWithUsername username="kai_hello" />
          <AvatarWithUsername username="kai_hello" />
        </AvatarsWrapper>
      </StoriesWrapper>
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
  margin-top: 12;
  padding-bottom: 28%;
`;

const Title = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
`;

const StoriesWrapper = styled(View)`
  margin-top: 24;
`;

const AvatarsWrapper = styled(ScrollView).attrs(props => ({
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
    <Avatar isExistStory={isExistStory} />
    <AvatarUsername>@{username}</AvatarUsername>
  </StyledAvatar>
);

const StyledAvatar = styled(TouchableOpacity)`
  margin-horizontal: 8;
  height: 100;
  flex-direction: column;
  justify-content: center;
`;

const AvatarUsername = styled(Text)`
  padding-top: 5;
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 12;
  text-align: center;
`;

const SearchAvatar = ({ navigation, following }) => (
  <StyledAvatar>
    <Background onPress={() => navigation.navigate('search')}>
      <AvatarImage source={require('assets/icons/search.png')} roundedWidth={30} />
    </Background>
    <AvatarUsername></AvatarUsername>
  </StyledAvatar>
);

const Background = styled(TouchableOpacity)`
  width: 60;
  height: 60;
  border-radius: 30;
  align-items: center;
  justify-content: center;
  background-color: ${path(['theme', 'listItemBg'])};
`;
