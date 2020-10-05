// @format
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchUserArchiveStoryies } from 'modules/instagram/insAuthActions';

const useFetchArchiveStory = (props, dependency = []) => {
  const [updatedAt, setUpdatedAt] = useState();
  const dispatch = useDispatch();

  const effectAction = async () => {
    await dispatch(fetchUserArchiveStoryies());
    setUpdatedAt(dayjs().valueOf());
  };

  useEffect(() => {
    effectAction();
  }, dependency);

  return { effectAction, updatedAt };
};

export default useFetchArchiveStory;
