"use client";

import { Dialog as DialogBase } from "@base-ui/react/dialog";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import { Button } from "../Button";
import styles from "./Dialog.module.css";

const DialogRoot = ({ ...props }: DialogBase.Root.Props) => {
  return <DialogBase.Root {...props} />;
};

const DialogTrigger = ({ ...props }: DialogBase.Trigger.Props) => {
  return <DialogBase.Trigger {...props} />;
};

const DialogPortal = ({ ...props }: DialogBase.Portal.Props) => {
  return <DialogBase.Portal {...props} />;
};

const DialogClose = ({ ...props }: DialogBase.Close.Props) => {
  return <DialogBase.Close {...props} />;
};

const DialogOverlay = ({ className, ...props }: DialogBase.Backdrop.Props) => {
  return <DialogBase.Backdrop className={clsx(styles.overlay, className)} {...props} />;
};

const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogBase.Popup.Props & {
  showCloseButton?: boolean;
}) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogBase.Popup className={clsx(styles.popup, className)} {...props}>
        {children}
        {showCloseButton && (
          <DialogClose
            render={
              <Button variant="ghost" size="icon-sm" className={styles.closeButton}>
                <XIcon />
                <span className="sr-only">Close</span>
              </Button>
            }
          />
        )}
      </DialogBase.Popup>
    </DialogPortal>
  );
};

const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.header, className)} {...props} />;
};

const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) => {
  return (
    <div className={clsx(styles.footer, className)} {...props}>
      {children}
      {showCloseButton && <DialogBase.Close render={<Button variant="outline">Close</Button>} />}
    </div>
  );
};

const DialogTitle = ({ className, ...props }: DialogBase.Title.Props) => {
  return <DialogBase.Title className={clsx(styles.title, className)} {...props} />;
};

const DialogDescription = ({ className, ...props }: DialogBase.Description.Props) => {
  return <DialogBase.Description className={clsx(styles.description, className)} {...props} />;
};

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Close: DialogClose,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
});
