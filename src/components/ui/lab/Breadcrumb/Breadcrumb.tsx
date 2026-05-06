import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import clsx from "clsx";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import styles from "./Breadcrumb.module.css";

const BreadcrumbRoot = ({ className, ...props }: React.ComponentProps<"nav">) => {
  return <nav aria-label="breadcrumb" className={clsx(className)} {...props} />;
};

const BreadcrumbList = ({ className, ...props }: React.ComponentProps<"ol">) => {
  return <ol className={clsx(styles.list, className)} {...props} />;
};

const BreadcrumbItem = ({ className, ...props }: React.ComponentProps<"li">) => {
  return <li className={clsx(styles.item, className)} {...props} />;
};

const BreadcrumbLink = ({ className, render, ...props }: useRender.ComponentProps<"a">) => {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: clsx(styles.link, className),
      },
      props,
    ),
    render,
  });
};

const BreadcrumbPage = ({ className, ...props }: React.ComponentProps<"span">) => {
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={clsx(styles.page, className)}
      {...props}
    />
  );
};

const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={clsx(styles.separator, className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
};

const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={clsx(styles.ellipsis, className)}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">Больше</span>
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
