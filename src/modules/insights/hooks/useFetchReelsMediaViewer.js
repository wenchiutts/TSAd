// @format
import { reduce } from 'ramda';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchReelsMediaViewer } from 'modules/instagram/insAuthActions';

const useFetchReelsMediaViewer = ({ ids }, dependency = []) => {
  const dispatch = useDispatch();

  const effectAction = async () => {
    await reduce(
      async (acc, c) => {
        await acc;
        return dispatch(fetchReelsMediaViewer(c));
      },
      Promise.resolve(),
      ids,
    );
  };

  useEffect(() => {
    effectAction();
  }, dependency);

  return { fetchReelsMediaViewer: effectAction };
};

export default useFetchReelsMediaViewer;
