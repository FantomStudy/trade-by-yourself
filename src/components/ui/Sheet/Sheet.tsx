"use client";

import { Dialog as SheetBase } from "@base-ui/react/dialog";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import { Button } from "../Button";
import styles from "./Sheet.module.css";

const SheetRoot = ({ ...props }: SheetBase.Root.Props) => {
  return <SheetBase.Root {...props} />;
};

const SheetTrigger = ({ ...props }: SheetBase.Trigger.Props) => {
  return <SheetBase.Trigger {...props} />;
};

const SheetClose = ({ ...props }: SheetBase.Close.Props) => {
  return <SheetBase.Close {...props} />;
};

const SheetContent = ({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetBase.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}) => {
  return (
    <SheetBase.Portal>
      <SheetBase.Backdrop className={clsx(styles.overlay, className)} />
      <SheetBase.Popup data-side={side} className={clsx(styles.content, className)} {...props}>
        {children}
        {showCloseButton && (
          <SheetBase.Close
            render={
              <Button variant="ghost" size="icon-sm" className={styles.closeButton}>
                <XIcon />
                <span className="sr-only">Close</span>
              </Button>
            }
          />
        )}
      </SheetBase.Popup>
    </SheetBase.Portal>
  );
};

const SheetHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.header, className)} {...props} />;
};

const SheetFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  return <div className={clsx(styles.footer, className)} {...props} />;
};

const SheetTitle = ({ className, ...props }: SheetBase.Title.Props) => {
  return <SheetBase.Title className={clsx(styles.title, className)} {...props} />;
};

const SheetDescription = ({ className, ...props }: SheetBase.Description.Props) => {
  return <SheetBase.Description className={clsx(styles.description, className)} {...props} />;
};

export const Sheet = Object.assign(SheetRoot, {
  Trigger: SheetTrigger,
  Close: SheetClose,
  Content: SheetContent,
  Header: SheetHeader,
  Footer: SheetFooter,
  Title: SheetTitle,
  Description: SheetDescription,
});
