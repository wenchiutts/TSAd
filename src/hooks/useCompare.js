// @format
import usePrevious from 'hooks/usePrevious';

const useCompare = value => {
  const prevValue = usePrevious(value);
  return prevValue !== value;
};

export default useCompare;
