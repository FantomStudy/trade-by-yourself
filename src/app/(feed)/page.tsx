import { Suspense } from "react";

import { Feed } from "./_components/feed";

const HomePage = () => {
  return (
    <div className="global-container">
      <Suspense fallback={<div>Loading...</div>}>
        <Feed />
      </Suspense>
    </div>
  );
};

export default HomePage;
