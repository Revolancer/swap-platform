import { FeedState, feedInitialState } from '../reducer';

const compareArrays = (a: object, b: object) => {
  const arrA = Object.values(a);
  const arrB = Object.values(b);
  return (
    arrA.length === arrB.length &&
    arrA.every((element: any, index: number) => {
      if (typeof element === 'object') {
        compareArrays(Object.values(element), Object.values(arrB[index]));
      }
      return element === arrB[index];
    })
  );
};

const isInitialState = (state: FeedState) => {
  return compareArrays(state, feedInitialState);
};

const filterFromInitial = (state: FeedState) => {
  if (isInitialState(state)) return;
  const initState = Object.entries(feedInitialState);
  const feedState = Object.entries(state).filter(([key, value], idx) => {
    if (typeof value === 'object') {
      if (value.length === 0) return false;
      return !compareArrays(
        Object.values(value),
        Object.values(initState[idx][1]),
      );
    }
    return value !== initState[idx][1];
  });
  return feedState;
};

export { compareArrays, isInitialState, filterFromInitial };
