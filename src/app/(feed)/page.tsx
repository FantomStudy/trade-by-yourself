import { Suspense } from "react";

import { Feed, HeroBanner } from "./_components";

const HomePage = () => {
  return (
    <>
      <HeroBanner />

      <div className="global-container">
        <Suspense fallback={<div>Loading...</div>}>
          <Feed />
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;
