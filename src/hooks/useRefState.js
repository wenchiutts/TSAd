import { useRef, useEffect } from 'react';

export default state => {
  const currentState = useRef();

  useEffect(() => {
    currentState.current = state;
  }, [state]);

  return currentState;
};
