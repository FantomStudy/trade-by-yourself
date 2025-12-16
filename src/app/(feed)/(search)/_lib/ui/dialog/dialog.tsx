"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import clsx from "clsx";
import { XIcon } from "lucide-react";

import styles from "./dialog.module.css";

const DialogRoot = (props: DialogPrimitive.DialogProps) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};

const DialogTrigger = (props: DialogPrimitive.DialogTriggerProps) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
};

const DialogClose = (props: DialogPrimitive.DialogCloseProps) => {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
};

interface DialogContentProps extends DialogPrimitive.DialogContentProps {
  showCloseButton?: boolean;
}

const DialogContent = ({
  showCloseButton = true,
  className,
  children,
  ...props
}: DialogContentProps) => {
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal">
      <DialogPrimitive.Overlay
        className={styles.overlay}
        data-slot="dialog-overlay"
      />
      <DialogPrimitive.Content
        className={clsx(styles.content, className)}
        data-slot="dialog-content"
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogClose className={styles.closeButton}>
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
};

const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={clsx(styles.header, className)}
      data-slot="dialog-header"
      {...props}
    />
  );
};

const DialogTitle = ({
  className,
  ...props
}: DialogPrimitive.DialogTitleProps) => {
  return (
    <DialogPrimitive.Title
      className={clsx(styles.title, className)}
      data-slot="dialog-title"
      {...props}
    />
  );
};

const DialogDescription = ({
  className,
  ...props
}: DialogPrimitive.DialogDescriptionProps) => {
  return (
    <DialogPrimitive.Description
      className={clsx(styles.description, className)}
      data-slot="dialog-description"
      {...props}
    />
  );
};

export type DialogProps = DialogPrimitive.DialogProps;

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
