// @format
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchUserArchiveStoryies } from 'modules/instagram/insAuthActions';

const useFetchArchiveStory = (props, dependency = []) => {
  const dispatch = useDispatch();

  const effectAction = async () => {
    await dispatch(fetchUserArchiveStoryies());
  };

  useEffect(() => {
    effectAction();
  }, dependency);

  return { effectAction };
};

export default useFetchArchiveStory;
