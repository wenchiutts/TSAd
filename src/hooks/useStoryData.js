// @format
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  cond,
  pathEq,
  converge,
  equals,
  path,
  compose,
  subtract,
  length,
  T,
  concat,
  take,
  pick,
  map,
  applySpec,
  evolve,
  when,
  head,
  reduce,
  takeLast,
  identity,
  slice,
  mergeRight,
  mergeDeepLeft,
  objOf,
  reject,
  includes,
  isEmpty,
  add,
  over,
  lensPath,
  __,
} from 'ramda';

// import useCompare from 'hooks/useCompare';
import { getStoryDetails } from 'apis/instagram';
import { isExist } from 'utils/ramdaUtils';
import { storyFeedPositionSelector } from 'modules/instagram/selector';

const isFirstDeck = pathEq(['deckIdx'], 0);
const isLastDeck = converge(equals, [
  path(['deckIdx']),
  compose(subtract(__, 1), length, path(['stories'])),
]);

const serializeStoryData = reduce(
  (acc, c) =>
    compose(
      mergeRight(acc),
      converge(objOf, [path(['id']), identity]),
      pick(['items', 'id', 'user']),
      evolve({
        items: map(
          applySpec({
            id: path(['owner', 'id']),
            src: path(['display_url']),
            isVideo: path(['is_video']),
            videoResources: compose(when(isExist, head), path(['video_resources'])),
          }),
        ),
      }),
    )(c),
  {},
);

const getFetchIdsByDeckIdx = ({ deckIdx, storyPosition }) =>
  cond([
    [isFirstDeck, compose(take(3), path(['storyPosition']))],
    [isLastDeck, compose(takeLast(3), path(['storyPosition']))],
    [T, compose(slice(deckIdx - 1, deckIdx + 2), path(['storyPosition']))],
  ])({ deckIdx, storyPosition });

const rejectFetchedIds = fetchedIds => reject(includes(__, fetchedIds));
const selector = createStructuredSelector({
  storyPosition: storyFeedPositionSelector,
});

const useStoryData = (stories, deckIdx) => {
  const [newStories, setNewStories] = useState(stories);
  const [isFetching, setIsFetching] = useState(false);
  const fetchedIds = useRef([]);
  const { storyPosition } = useSelector(selector);
  // const storiesHasChanged = useCompare(stories);
  useEffect(() => {
    const effectAction = async () => {
      const ids = compose(
        rejectFetchedIds(fetchedIds.current),
        getFetchIdsByDeckIdx,
      )({ deckIdx, storyPosition });
      if (!isEmpty(ids)) {
        setIsFetching(true);
        const result = await getStoryDetails({ reelIds: ids });
        fetchedIds.current = concat(fetchedIds.current, ids);
        const withStories = serializeStoryData(result);
        setNewStories(prevStories => mergeDeepLeft(withStories, prevStories));
        setIsFetching(false);
      }
    };

    effectAction();
  }, [stories, deckIdx]);

  const setStoryIdx = diff => {
    const lensStory = lensPath([storyPosition[deckIdx]]);
    setNewStories(prevStories => over(lensStory, evolve({ idx: add(diff) }), prevStories));
  };

  const getDeckInfo = idx => {
    const id = storyPosition[idx];
    return newStories[id];
  };

  return {
    stories: newStories,
    isFetchingStories: isFetching,
    storyPosition,
    setStoryIdx,
    getDeckInfo,
  };
};

export default useStoryData;
