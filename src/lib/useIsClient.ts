import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True once mounted in the browser; false during SSR — avoids hydration mismatches for portals. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
