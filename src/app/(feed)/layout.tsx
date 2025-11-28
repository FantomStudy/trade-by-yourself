import type { ReactNode } from "react";


const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        marginTop: "calc(-1 * var(--space-md))",
      }}
    >
      {/* <Search /> */}
      {children}
    </div>
  );
};

export default HomeLayout;
