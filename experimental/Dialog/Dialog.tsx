"use client";

import { Dialog as DialogBase } from "@base-ui/react/dialog";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import { Button } from "../Button";
import styles from "./Dialog.module.css";

export const Dialog = ({ ...props }: DialogBase.Root.Props) => {
  return <DialogBase.Root {...props} />;
};

export const DialogTrigger = ({ ...props }: DialogBase.Trigger.Props) => {
  return <DialogBase.Trigger {...props} />;
};

export const DialogPortal = ({ ...props }: DialogBase.Portal.Props) => {
  return <DialogBase.Portal {...props} />;
};

export const DialogClose = ({ ...props }: DialogBase.Close.Props) => {
  return <DialogBase.Close {...props} />;
};

export const DialogOverlay = ({ className, ...props }: DialogBase.Backdrop.Props) => {
  return <DialogBase.Backdrop className={clsx(styles.overlay, className)} {...props} />;
};

export const DialogContent = ({
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
          <DialogBase.Close
            render={
              <Button variant="ghost" className={styles.closeButton} size="icon-sm">
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

export const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.header, className)} {...props} />;
};

export const DialogFooter = ({
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

export const DialogTitle = ({ className, ...props }: DialogBase.Title.Props) => {
  return <DialogBase.Title className={clsx(styles.title, className)} {...props} />;
};

export const DialogDescription = ({ className, ...props }: DialogBase.Description.Props) => {
  return <DialogBase.Description className={clsx(styles.description, className)} {...props} />;
};
