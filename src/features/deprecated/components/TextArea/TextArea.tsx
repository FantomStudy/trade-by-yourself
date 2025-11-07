"use client";

import React from "react";

import styles from "./TextArea.module.css";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  placeholder?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  placeholder,
  error,
  className,
  ...props
}) => {
  return (
    <div className={styles.container}>
      <textarea
        className={`${styles.textarea} ${error ? styles.error : ""} ${
          className || ""
        }`}
        placeholder={placeholder}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
