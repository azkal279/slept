import { useCallback, useState } from 'react';

// Returning a new object reference guarantees that a before-and-after
//   equivalence check will always be false, resulting in a re-render, even
//   when multiple calls to forceUpdate are batched.

export default function useForceUpdate(): () => void {
  let [ , dispatch ] = useState<{}>(Object.create(null));

  // Turn dispatch(required_parameter) into dispatch().
  let memoizedDispatch = useCallback(
    (): void => {
      dispatch(Object.create(null));
    },
    [ dispatch ],
  );
  return memoizedDispatch;
}