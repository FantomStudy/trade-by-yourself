import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import styles from "./breadcrumb.module.css";

const BreadcrumbRoot = (props: React.ComponentProps<"nav">) => {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
};

const BreadcrumbList = ({
  className,
  ...props
}: React.ComponentProps<"ol">) => {
  return (
    <ol
      className={clsx(styles.list, className)}
      data-slot="breadcrumb-list"
      {...props}
    />
  );
};

const BreadcrumbItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => {
  return (
    <li
      className={clsx(styles.item, className)}
      data-slot="breadcrumb-item"
      {...props}
    />
  );
};

const BreadcrumbLink = ({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      className={clsx(styles.link, className)}
      data-slot="breadcrumb-link"
      {...props}
    />
  );
};

const BreadcrumbPage = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  return (
    <span
      aria-current="page"
      aria-disabled="true"
      className={clsx(styles.page, className)}
      data-slot="breadcrumb-page"
      role="link"
      {...props}
    />
  );
};

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => {
  return (
    <li
      aria-hidden="true"
      className={clsx(styles.separator, className)}
      data-slot="breadcrumb-separator"
      role="presentation"
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
};

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => {
  return (
    <span
      aria-hidden="true"
      className={clsx(styles.ellipsis, className)}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      {...props}
    >
      <MoreHorizontal className={styles.moreIcon} />
      <span className="sr-only">More</span>
    </span>
  );
};

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
});
