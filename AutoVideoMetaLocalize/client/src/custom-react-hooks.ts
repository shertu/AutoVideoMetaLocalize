import * as React from 'react';

/**
 * A custom react hook used to repeatedly call a callback function on a regular interval.
 *
 * @param {number} delay
 * @param {Function} callback
 */
export function useInterval(delay: number, callback: Function): void {
  const savedCallback = React.useRef<Function>();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    /** The function called after each tick of the interval. */
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
