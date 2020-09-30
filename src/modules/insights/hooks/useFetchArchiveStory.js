// @format
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchUserArchiveStoryies } from 'modules/instagram/insAuthActions';

const useFetchArchiveStory = (props, dependency = []) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const effectAction = async () => {
      await dispatch(fetchUserArchiveStoryies());
    };

    effectAction();
  }, dependency);
};

export default useFetchArchiveStory;
