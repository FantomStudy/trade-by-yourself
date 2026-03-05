import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import styles from "./Breadcrumb.module.css";

export const Breadcrumb = (props: React.ComponentProps<"nav">) => {
  return <nav aria-label="breadcrumb" {...props} />;
};

export const BreadcrumbList = ({
  className,
  ...props
}: React.ComponentProps<"ol">) => {
  return <ol className={clsx(styles.list, className)} {...props} />;
};

export const BreadcrumbItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => {
  return <li className={clsx(styles.item, className)} {...props} />;
};

export const BreadcrumbLink = ({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) => {
  const Comp = asChild ? Slot : "a";

  return <Comp className={clsx(styles.link, className)} {...props} />;
};

export const BreadcrumbPage = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  return (
    <span
      aria-current="page"
      aria-disabled="true"
      className={clsx(styles.page, className)}
      role="link"
      {...props}
    />
  );
};

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => {
  return (
    <li
      aria-hidden="true"
      className={clsx(styles.separator, className)}
      role="presentation"
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
};

export const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  return (
    <span
      aria-hidden="true"
      className={clsx(styles.ellipsis, className)}
      role="presentation"
      {...props}
    >
      <MoreHorizontal className={styles.moreIcon} />
      <span className="sr-only">More</span>
    </span>
  );
};
