import Image from "next/image";

import styles from "./FullBanner.module.css";

export const FullBanner = () => {
  return (
    <div className={styles.banner}>
      <Image
        alt="Banner full"
        className={styles.image}
        height={200}
        src="/banner-full.png"
        width={1440}
      />
    </div>
  );
};
