"use client";

import type { ToasterProps } from "sonner";
import clsx from "clsx";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster } from "sonner";
import styles from "./Sonner.module.css";

const inlineVariables = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
} as React.CSSProperties;

export const Sonner = ({ ...props }: ToasterProps) => {
  return (
    <Toaster
      style={inlineVariables}
      theme="system"
      icons={{
        success: <CircleCheckIcon className={styles.icon} />,
        info: <InfoIcon className={styles.icon} />,
        warning: <TriangleAlertIcon className={styles.icon} />,
        error: <OctagonXIcon className={styles.icon} />,
        loading: <Loader2Icon className={clsx(styles.icon, styles.loading)} />,
      }}
      {...props}
    />
  );
};
