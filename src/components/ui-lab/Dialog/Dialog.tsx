"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import styles from "./Dialog.module.css";

export const Dialog = (props: DialogPrimitive.DialogProps) => (
  <DialogPrimitive.Root {...props} />
);

export const DialogTrigger = (props: DialogPrimitive.DialogTriggerProps) => (
  <DialogPrimitive.Trigger {...props} />
);

export const DialogPortal = (props: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props} />
);

export const DialogClose = (props: DialogPrimitive.DialogCloseProps) => (
  <DialogPrimitive.Close {...props} />
);

export const DialogOverlay = ({
  className,
  ...props
}: DialogPrimitive.DialogOverlayProps) => (
  <DialogPrimitive.Overlay
    className={clsx(styles.overlay, className)}
    {...props}
  />
);

export const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.DialogContentProps & { showCloseButton?: boolean }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={clsx(styles.content, className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close className={styles.closeButton}>
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
);

export const DialogHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div className={clsx(styles.header, className)} {...props} />
);

export const DialogFooter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div className={clsx(styles.footer, className)} {...props} />
);

export const DialogTitle = (props: DialogPrimitive.DialogTitleProps) => (
  <DialogPrimitive.Title
    className={clsx(styles.title, props.className)}
    {...props}
  />
);

export const DialogDescription = (
  props: DialogPrimitive.DialogDescriptionProps,
) => <DialogPrimitive.Description className={styles.description} {...props} />;
