import { useState } from "react";

// Reference:
// https://stackoverflow.com/questions/38598280/is-it-possible-to-wrap-a-function-and-retain-its-types

export default function useServerActionWithPendingState<T extends Array<unknown>, U>(
  serverAction: (...args: T) => Promise<U>,
): [isPending: boolean, serverAction: (...args: T) => Promise<U>] {
  const [isPending, setIsPending] = useState(false);

  const wrapperFn = async (...args: T) => {
    setIsPending(true);
    const result = await serverAction(...args);
    setIsPending(false);

    return result;
  };

  return [isPending, wrapperFn];
}
