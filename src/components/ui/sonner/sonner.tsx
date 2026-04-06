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
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

import styles from "./sonner.module.css";

const inlineVariables = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
};

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className={styles.toaster}
      style={inlineVariables as React.CSSProperties}
      theme={theme as ToasterProps["theme"]}
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

export { Toaster };
