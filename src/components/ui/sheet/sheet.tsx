"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import * as React from "react";

import styles from "./sheet.module.css";

const Sheet = (props: SheetPrimitive.DialogProps) => (
  <SheetPrimitive.Root data-slot="sheet" {...props} />
);

const SheetTrigger = (props: SheetPrimitive.DialogTriggerProps) => (
  <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
);

const SheetPortal = (props: SheetPrimitive.DialogPortalProps) => (
  <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
);

const SheetClose = (props: SheetPrimitive.DialogCloseProps) => (
  <SheetPrimitive.Close data-slot="sheet-close" {...props} />
);

const SheetOverlay = ({ className, ...props }: SheetPrimitive.DialogOverlayProps) => (
  <SheetPrimitive.Overlay
    className={clsx(styles.overlay, className)}
    data-slot="sheet-overlay"
    {...props}
  />
);

type SheetContentProps = SheetPrimitive.DialogContentProps & {
  showCloseButton?: boolean;
  side?: "bottom" | "left" | "right" | "top";
};

const SheetContent = ({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetContentProps) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      className={clsx(styles.content, styles[side], className)}
      data-slot="sheet-content"
      {...props}
    >
      {children}
      {showCloseButton && (
        <SheetPrimitive.Close className={styles.close} data-slot="sheet-close">
          <XIcon className={styles.closeIcon} />
          <span className="sr-only">Закрыть</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Content>
  </SheetPortal>
);

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(styles.header, className)} data-slot="sheet-header" {...props} />
);

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx(styles.footer, className)} data-slot="sheet-footer" {...props} />
);

const SheetTitle = ({ className, ...props }: SheetPrimitive.DialogTitleProps) => (
  <SheetPrimitive.Title
    className={clsx(styles.title, className)}
    data-slot="sheet-title"
    {...props}
  />
);

const SheetDescription = ({ className, ...props }: SheetPrimitive.DialogDescriptionProps) => (
  <SheetPrimitive.Description
    className={clsx(styles.description, className)}
    data-slot="sheet-description"
    {...props}
  />
);

Sheet.Trigger = SheetTrigger;
Sheet.Portal = SheetPortal;
Sheet.Close = SheetClose;
Sheet.Overlay = SheetOverlay;
Sheet.Content = SheetContent;
Sheet.Header = SheetHeader;
Sheet.Footer = SheetFooter;
Sheet.Title = SheetTitle;
Sheet.Description = SheetDescription;

export { Sheet };
