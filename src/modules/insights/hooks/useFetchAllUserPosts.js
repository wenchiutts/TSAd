// @format
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchAllUserPosts } from 'modules/instagram/insAuthActions';

const useFetchAllUserPosts = (endCursor, dependency = []) => {
  const dispatch = useDispatch();

  const fetchAllUserPostsEffect = async after => {
    await dispatch(fetchAllUserPosts(after));
  };

  useEffect(() => {
    fetchAllUserPostsEffect(endCursor);
  }, dependency);

  return { fetchAllUserPostsEffect };
};

export default useFetchAllUserPosts;
