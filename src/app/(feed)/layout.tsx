import type { ReactNode } from "react";

import { HeroBanner } from "@/components/sponsorship";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <HeroBanner />
      {children}
    </>
  );
};

export default HomeLayout;
