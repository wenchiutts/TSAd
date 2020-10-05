// @format
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchAllUserPosts } from 'modules/instagram/insAuthActions';

const useFetchAllUserPosts = (props, dependency = []) => {
  const dispatch = useDispatch();

  const fetchAllUserPostsEffect = async () => {
    await dispatch(fetchAllUserPosts());
  };

  useEffect(() => {
    fetchAllUserPostsEffect();
  }, dependency);

  return { fetchAllUserPostsEffect };
};

export default useFetchAllUserPosts;
