import Image from "next/image";

import styles from "./hero.module.css";

export const HeroBanner = () => {
  return (
    <div className={styles.hero}>
      <Image
        alt="Hero Section"
        className={styles.image}
        height={300}
        src="/hero-section.png"
        width={1440}
        priority
      />
    </div>
  );
};
