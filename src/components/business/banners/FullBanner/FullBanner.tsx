import Image from "next/image";
import styles from "./FullBanner.module.css";

export const FullBanner = () => {
  return (
    <div className={styles.banner}>
      <Image
        src="/banner-full.png"
        alt="Banner full"
        width={1440}
        height={200}
        className={styles.image}

      />
    </div>
  );
};
