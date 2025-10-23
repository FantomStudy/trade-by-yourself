import Image from "next/image";
import styles from "./HeroBanner.module.css";

export const HeroBanner = () => {
  return (
    <div className={styles.banner}>
      <Image
        src="/hero-section.png"
        alt="Hero Section"
        height={300}
        width={1440}
        priority
        className={styles.image}
      />
    </div>
  );
};
