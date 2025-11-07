"use client";

import React from "react";

import styles from "./Select.module.css";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  placeholder,
  options,
  error,
  className,
  ...props
}) => {
  return (
    <div className={styles.container}>
      <select
        className={`${styles.select} ${error ? styles.error : ""} ${
          className || ""
        }`}
        {...props}
      >
        {placeholder && (
          <option disabled value="">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
