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
import { Toaster } from "sonner";

import styles from "./sonner.module.css";

export type SonnerProps = ToasterProps;

export const Sonner = (props: SonnerProps) => {
  const { theme = "light" } = useTheme();

  const inlineVariables = {
    "--normal-bg": "var(--popover)",
    "--normal-text": "var(--popover-foreground)",
    "--normal-border": "var(--border)",
  } as React.CSSProperties;

  return (
    <Toaster
      className={styles.toaster}
      style={inlineVariables}
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
