import { useState } from "react";

export function useOptimistic(initial) {
  const [state, setState] = useState(initial);

  const run = (optimisticValue, confirmFn, rollbackFn) => {
    setState(optimisticValue);
    confirmFn()
      .then((res) => setState(res))
      .catch(() => {
        if (rollbackFn) rollbackFn();
      });
  };

  return [state, run];
}
