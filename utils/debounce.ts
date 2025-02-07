type Procedure = (...args: unknown[]) => void;

export function debounce<F extends Procedure>(func: F, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
