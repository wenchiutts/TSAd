// @format
import * as React from 'react';
import { Text, View, FlatList, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { path, pathOr } from 'ramda';

import IconListItem from 'components/IconListItem';
import useFetchArchiveStory from 'modules/insights/hooks/useFetchArchiveStory';

const { width: screenWidth } = Dimensions.get('window');

const StyledView = styled(View)`
  flex: 1;
  background-color: ${path(['theme', 'screenBackground'])};
  padding-horizontal: 12;
  padding-top: 0;
`;

const ListWrapper = styled(View)`
  margin-vertical: 20;
  width: 100%;
`;

const Title = styled(Text)`
  color: ${path(['theme', 'primary', 'lightBlue'])};
`;

const StyledIconList = styled(IconListItem)`
  margin-top: ${pathOr(12, ['margin'])};
  width: ${(screenWidth - 35) / 2};
  padding-right: 12;
  padding-left: 12;
`;

const storyInsightList = [
  {
    iconSource: require('assets/icons/history.png'),
    description: 'History',
    route: 'StoryHistory',
  },
  {
    iconSource: require('assets/icons/followstatus_best.png'),
    description: 'Top viewers',
    navigation: () => navigation.navigate(''),
  },
  {
    iconSource: require('assets/icons/followstatus_ghost.png'),
    description: 'Least viewers',
    navigation: () => navigation.navigate(''),
  },
  {
    iconSource: require('assets/icons/mostviewed.png'),
    description: 'Most viewed storyies',
    route: 'MostViewedStories',
  },
  {
    iconSource: require('assets/icons/leastviewed.png'),
    description: 'Least viewed storyies',
    route: 'LeastViewedStories',
  },
];

const postInsightList = [
  {
    iconSource: require('assets/icons/popular.png'),
    description: 'Most popular posts',
    route: 'MostPopularPosts',
  },
  {
    iconSource: require('assets/icons/mostliked.png'),
    description: 'Most liked posts',
    route: 'MostLikedPosts',
  },
  {
    iconSource: require('assets/icons/mostcommend.png'),
    description: 'Most commented posts',
    route: 'MostCommentedPosts',
  },
];

const InsightScreen = ({ navigation }) => {
  useFetchArchiveStory();
  return (
    <StyledView>
      <ListWrapper>
        <Title>Story Insights</Title>
        <FlatList
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          numColumns={2}
          data={storyInsightList}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <StyledIconList
              {...item}
              onPress={() => item.route && navigation.navigate(item.route)}
            />
          )}
        />
      </ListWrapper>
      <ListWrapper>
        <Title>Post Insights</Title>
        <FlatList
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          numColumns={2}
          data={postInsightList}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <StyledIconList {...item} onPress={() => navigation.navigate(item.route)} />
          )}
        />
      </ListWrapper>
    </StyledView>
  );
};

InsightScreen.propTypes = {};

export default InsightScreen;
