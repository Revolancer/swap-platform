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

export { compareArrays };
