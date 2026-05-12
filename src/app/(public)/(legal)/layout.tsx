import styles from "./legal.module.css";

const StaticLayout = ({ children }: LayoutProps<"/">) => {
  return <div className={styles.layout}>{children}</div>;
};

export default StaticLayout;
