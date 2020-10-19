// @format
import { useEffect, useState, useRef } from 'react';
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
  ifElse,
  gte,
  always,
  curry,
  lt,
} from 'ramda';

// import useCompare from 'hooks/useCompare';
import { getStoryDetails } from 'apis/instagram';
import { isExist } from 'utils/ramdaUtils';
import DEBUG from 'utils/logUtils';

const isFirstDeck = pathEq(['deckIdx'], 0);
const isLastDeck = converge(equals, [
  path(['deckIdx']),
  compose(subtract(__, 1), length, path(['deckPosition'])),
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
            takenAt: path(['taken_at_timestamp']),
          }),
        ),
      }),
    )(c),
  {},
);

const getFetchIdsByDeckIdx = ({ deckIdx, deckPosition }) =>
  cond([
    [isFirstDeck, compose(take(3), path(['deckPosition']))],
    [isLastDeck, compose(takeLast(3), path(['deckPosition']))],
    [T, compose(slice(deckIdx - 1, deckIdx + 2), path(['deckPosition']))],
  ])({ deckIdx, deckPosition });

const rejectFetchedIds = fetchedIds => reject(includes(__, fetchedIds));

const useStoryData = (stories, deckIdx, deckPosition) => {
  const [newStories, setNewStories] = useState(stories);
  const [isFetching, setIsFetching] = useState(true);
  const fetchedIds = useRef([]);
  // const storiesHasChanged = useCompare(stories);
  useEffect(() => {
    const effectAction = async () => {
      const ids = compose(
        rejectFetchedIds(fetchedIds.current),
        getFetchIdsByDeckIdx,
      )({ deckIdx, deckPosition });
      if (!isEmpty(ids)) {
        setIsFetching(true);
        try {
          const result = await getStoryDetails({ reelIds: ids });
          fetchedIds.current = concat(fetchedIds.current, ids);
          const withStories = serializeStoryData(result);
          setNewStories(prevStories => mergeDeepLeft(withStories, prevStories));
        } catch (e) {
          DEBUG.log('fetch story failed', e, e.response);
        }
        setIsFetching(false);
      }
    };

    effectAction();
  }, [stories, deckIdx]);

  const setStoryIdx = diff => {
    const lensStory = lensPath([deckPosition[deckIdx]]);
    setNewStories(prevStories => over(lensStory, evolve({ idx: add(diff) }), prevStories));
  };

  const getDeckInfo = idx => {
    const id = deckPosition[idx];
    return path([id], newStories);
  };

  const getWindowData = curry((size, currentPosition, data) => {
    const length = data.length;
    const head = ifElse(gte(__, 0), identity, always(0))(currentPosition - size);
    const tail =
      head === 0
        ? 2 * size
        : ifElse(lt(__, length), identity, always(length - 1))(currentPosition + size);
    const finalHead = tail === length - 1 ? tail - 2 * size : head;
    return slice(finalHead, tail + 1)(data);
  });

  const getPartialList = curry((size, currentPosition, data) =>
    slice(0, currentPosition + size + 1, data),
  );

  return {
    stories: newStories,
    isFetchingStories: isFetching,
    setStoryIdx,
    getDeckInfo,
    getWindowData,
    getPartialList,
  };
};

export default useStoryData;
