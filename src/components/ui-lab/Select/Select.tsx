"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import clsx from "clsx";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import styles from "./Select.module.css";

export const Select = ({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) => {
  return <SelectPrimitive.Root {...props} />;
};

export const SelectGroup = ({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) => {
  return <SelectPrimitive.Group {...props} />;
};

export const SelectValue = ({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) => {
  return <SelectPrimitive.Value {...props} />;
};

export const SelectTrigger = ({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "default" | "sm";
}) => {
  return (
    <SelectPrimitive.Trigger
      className={clsx(styles.trigger, className)}
      data-size={size}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
};

export const SelectScrollUpButton = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) => {
  return (
    <SelectPrimitive.ScrollUpButton
      className={clsx(styles.scrollButton, className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
};

export const SelectScrollDownButton = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) => {
  return (
    <SelectPrimitive.ScrollDownButton
      className={clsx(styles.scrollButton, className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
};

export const SelectContent = ({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        align={align}
        className={clsx(styles.content, className)}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={clsx(
            styles.viewport,
            position === "popper" && styles.viewportPopper,
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
};

export const SelectLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) => {
  return (
    <SelectPrimitive.Label
      className={clsx(styles.label, className)}
      {...props}
    />
  );
};

export const SelectItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) => {
  return (
    <SelectPrimitive.Item className={clsx(styles.item, className)} {...props}>
      <span className={styles.itemIndicator}>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};

export const SelectSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) => {
  return (
    <SelectPrimitive.Separator
      className={clsx(styles.separator, className)}
      {...props}
    />
  );
};
