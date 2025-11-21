import type { ReactNode } from "react";

import { Search } from "./_components";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        marginTop: "calc(-1 * var(--space-md))",
      }}
    >
      <Search />
      {children}
    </div>
  );
};

export default HomeLayout;
