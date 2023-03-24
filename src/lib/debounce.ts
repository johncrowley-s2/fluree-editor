export const debounce = (func: any, delay: number) => {
  let timeoutId: number;
  let result: any;

  return function (...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      result = func.apply(null, args);
    }, delay);

    return result;
  };
};
