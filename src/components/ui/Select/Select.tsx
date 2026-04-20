"use client";

import { Select as SelectBase } from "@base-ui/react/select";
import clsx from "clsx";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import styles from "./Select.module.css";

const SelectRoot = SelectBase.Root;

const SelectGroup = ({ className, ...props }: SelectBase.Group.Props) => {
  return <SelectBase.Group className={clsx(styles.group, className)} {...props} />;
};

const SelectValue = ({ className, ...props }: SelectBase.Value.Props) => {
  return <SelectBase.Value className={clsx(styles.value, className)} {...props} />;
};

const SelectTrigger = ({
  className,
  size = "default",
  children,
  ...props
}: SelectBase.Trigger.Props & {
  size?: "sm" | "default";
  autoComplete?: "off" | "on";
}) => {
  return (
    <SelectBase.Trigger className={clsx(styles.trigger, styles[size], className)} {...props}>
      {children}
      <SelectBase.Icon render={<ChevronDownIcon className={styles.triggerIcon} />} />
    </SelectBase.Trigger>
  );
};

const SelectSeparator = ({ className, ...props }: SelectBase.Separator.Props) => {
  return <SelectBase.Separator className={clsx(styles.separator, className)} {...props} />;
};

const SelectScrollUpButton = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectBase.ScrollUpArrow>) => {
  return (
    <SelectBase.ScrollUpArrow className={clsx(styles.scrollArrow, className)} {...props}>
      <ChevronUpIcon />
    </SelectBase.ScrollUpArrow>
  );
};

const SelectScrollDownButton = ({
  className,
  ...props
}: React.ComponentProps<typeof SelectBase.ScrollDownArrow>) => {
  return (
    <SelectBase.ScrollDownArrow className={clsx(styles.scrollArrow, className)} {...props}>
      <ChevronDownIcon />
    </SelectBase.ScrollDownArrow>
  );
};

const SelectContent = ({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectBase.Popup.Props &
  Pick<
    SelectBase.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) => {
  return (
    <SelectBase.Portal>
      <SelectBase.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className={styles.positioner}
      >
        <SelectBase.Popup
          data-align-trigger={alignItemWithTrigger}
          className={clsx(styles.popup, className)}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectBase.List>{children}</SelectBase.List>
          <SelectScrollDownButton />
        </SelectBase.Popup>
      </SelectBase.Positioner>
    </SelectBase.Portal>
  );
};

const SelectLabel = ({ className, ...props }: SelectBase.GroupLabel.Props) => {
  return <SelectBase.GroupLabel className={clsx(styles.label, className)} {...props} />;
};

const SelectItem = ({ className, children, ...props }: SelectBase.Item.Props) => {
  return (
    <SelectBase.Item className={clsx(styles.item, className)} {...props}>
      <SelectBase.ItemText className={styles.itemText}>{children}</SelectBase.ItemText>
      <SelectBase.ItemIndicator
        render={
          <span className={styles.itemIndicator}>
            <CheckIcon />
          </span>
        }
      />
    </SelectBase.Item>
  );
};

export const Select = Object.assign(SelectRoot, {
  Group: SelectGroup,
  Value: SelectValue,
  Trigger: SelectTrigger,
  Separator: SelectSeparator,
  ScrollUpButton: SelectScrollUpButton,
  ScrollDownButton: SelectScrollDownButton,
  Content: SelectContent,
  Label: SelectLabel,
  Item: SelectItem,
});
