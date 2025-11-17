import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { TailwindIndicator } from "./tailwind-indicator";

export const DevTools = () => {
  return (
    <>
      <TailwindIndicator />
      <ReactQueryDevtools />
    </>
  );
};
