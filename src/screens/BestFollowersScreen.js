import * as React from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { View, Text, FlatList, Image } from 'react-native';
import styled from 'styled-components/native';
import { compose, pathOr, length, path, pathEq, cond, sort, descend, propOr } from 'ramda';

import UserListItem from 'components/UserListItem';
import ActiveStateButton from 'components/ActiveStateButton';
import { postsListSelector, bestFollowerListSelector } from 'modules/instagram/selector';
import i18n from 'i18n';

const LocalUserListItem = ({
  username,
  isFollower,
  isFollowing,
  likes = 0,
  comments = 0,
  activeIndex,
  profilePicture,
  userId,
}) => (
  <UserListItem
    username={username}
    isFollower={isFollower}
    isFollowing={isFollowing}
    buttonHide
    profilePicture={profilePicture}
    userId={userId}
    descriptionElement={
      activeIndex !== -1 ? (
        <DescriptionWrapper
          iconType={activeIndex === 0 ? 'like' : 'comment'}
          value={activeIndex === 0 ? likes : comments}
        />
      ) : undefined
    }
  />
);

const DescriptionWrapper = ({ iconType, value }) => (
  <View style={{ height: 18, flexDirection: 'row' }}>
    {iconType === 'like' && <StyledImage source={require('assets/icons/like_small.png')} />}
    {iconType === 'comment' && <StyledImage source={require('assets/icons/comment_small.png')} />}
    <Description>{value}</Description>
  </View>
);

const ListItem = activeIndex => ({ item }) => (
  <LocalUserListItem
    username={item?.owner?.username}
    isFollower={item?.isFollower}
    isFollowing={item?.isFollowing}
    likes={item?.likeOnCount}
    comments={item?.commentOnCount}
    activeIndex={activeIndex}
    profilePicture={item?.owner?.profile_pic_url}
    userId={item?.owner?.id}
  />
);

const StyledImage = styled(Image)`
  width: 20;
  height: 20;
  margin-right: 8;
`;

const Description = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
  font-size: 14;
`;

const selector = createStructuredSelector({
  bestie: bestFollowerListSelector,
});

const byCount = (propName = 'count') => descend(propOr(0, propName));

const BestFollowersScreen = () => {
  const { bestie } = useSelector(selector);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  return (
    <StyledView>
      <ButtonWrapper>
        <ActiveStateButton
          text={i18n.t('active_state_button_like')}
          isActive={activeIndex === 0}
          onPress={() => setActiveIndex(prevState => (prevState === 0 ? -1 : 0))}
        />
        <ActiveStateButton
          text={i18n.t('active_state_button_comment')}
          isActive={activeIndex === 1}
          onPress={() => setActiveIndex(prevState => (prevState === 1 ? -1 : 1))}
        />
      </ButtonWrapper>
      <ListWrapper
        data={cond([
          [pathEq(['activeIndex'], -1), path(['bestie'])],
          [pathEq(['activeIndex'], 0), compose(sort(byCount('likeOnCount')), path(['bestie']))],
          [pathEq(['activeIndex'], 1), compose(sort(byCount('commentOnCount')), path(['bestie']))],
        ])({ bestie, activeIndex })}
        initialNumToRender={10}
        renderItem={ListItem(activeIndex)}
        keyExtractor={path(['owner', 'id'])}
      />
    </StyledView>
  );
};

export default BestFollowersScreen;

const StyledView = styled(View)`
  justify-content: flex-start;
  align-items: center;
  padding-top: 10;
  padding-horizontal: 20;
  flex: 1;
`;

const ButtonWrapper = styled(View)`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: 3%;
`;

const ListWrapper = styled(FlatList)`
  width: 100%;
`;
