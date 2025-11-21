"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import * as React from "react";

import styles from "./dialog.module.css";

const Dialog = (props: DialogPrimitive.DialogProps) => (
  <DialogPrimitive.Root data-slot="dialog" {...props} />
);

const DialogTrigger = (props: DialogPrimitive.DialogTriggerProps) => (
  <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
);

const DialogPortal = (props: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
);

const DialogClose = (props: DialogPrimitive.DialogCloseProps) => (
  <DialogPrimitive.Close data-slot="dialog-close" {...props} />
);

const DialogOverlay = ({
  className,
  ...props
}: DialogPrimitive.DialogOverlayProps) => (
  <DialogPrimitive.Overlay
    className={clsx(styles.overlay, className)}
    data-slot="dialog-overlay"
    {...props}
  />
);

const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.DialogContentProps & { showCloseButton?: boolean }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={clsx(styles.content, className)}
      data-slot="dialog-content"
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          className={styles.closeButton}
          data-slot="dialog-close"
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
);

const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={clsx(styles.header, className)}
    data-slot="dialog-header"
    {...props}
  />
);

const DialogFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={clsx(styles.footer, className)}
    data-slot="dialog-footer"
    {...props}
  />
);

const DialogTitle = (props: DialogPrimitive.DialogTitleProps) => (
  <DialogPrimitive.Title
    className={clsx(styles.title, props.className)}
    data-slot="dialog-title"
    {...props}
  />
);

const DialogDescription = (props: DialogPrimitive.DialogDescriptionProps) => (
  <DialogPrimitive.Description
    className={styles.description}
    data-slot="dialog-description"
    {...props}
  />
);

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
