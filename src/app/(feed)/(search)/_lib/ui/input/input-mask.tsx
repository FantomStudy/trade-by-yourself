"use client";

import type { InputProps } from ".";

import { useCallback, useMemo, useRef } from "react";

import { Input } from ".";
import { applyMask, extractValue, getProtectedPrefix } from "./utils";

export interface InputMaskProps extends InputProps {
  mask: string;
  value?: string;
}

export const InputMask = ({
  mask,
  value = "",
  onChange: externalOnChange,
  ...props
}: InputMaskProps) => {
  const protectedPrefix = useMemo(() => getProtectedPrefix(mask), [mask]);
  const internalRef = useRef<HTMLInputElement>(null);

  const getDisplayValue = useCallback(
    (value: string | undefined): string => {
      if (!value) return protectedPrefix;
      if (value.startsWith(protectedPrefix)) return value;
      const extracted = extractValue(value, mask);
      return applyMask(extracted, mask, protectedPrefix);
    },
    [mask, protectedPrefix],
  );

  const displayValue = useMemo(() => getDisplayValue(value), [value, getDisplayValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value;
      let masked: string;
      let extracted: string;

      if (inputValue.length < protectedPrefix.length || !inputValue.startsWith(protectedPrefix)) {
        masked = protectedPrefix;
        extracted = "";
      } else {
        extracted = extractValue(inputValue, mask);
        masked = applyMask(extracted, mask, protectedPrefix);
      }

      if (externalOnChange) {
        const outputValue = masked;

        const syntheticEvent = {
          ...e,
          currentTarget: {
            ...e.currentTarget,
            value: outputValue,
          },
          target: {
            ...e.target,
            value: outputValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        externalOnChange(syntheticEvent);
      }
    },
    [mask, protectedPrefix, externalOnChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const selectionStart = input.selectionStart || 0;
      const selectionEnd = input.selectionEnd || 0;

      if (e.key === "Backspace" || e.key === "Delete") {
        if (selectionStart < protectedPrefix.length) {
          e.preventDefault();
          if (selectionStart === 0 && selectionEnd >= input.value.length) {
            if (externalOnChange) {
              const outputValue = protectedPrefix;
              console.log(outputValue);

              const syntheticEvent = {
                ...e,
                currentTarget: {
                  ...input,
                  value: outputValue,
                },
                target: {
                  ...input,
                  value: outputValue,
                },
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              externalOnChange(syntheticEvent);
            }

            setTimeout(() => {
              if (internalRef.current) {
                internalRef.current.setSelectionRange(
                  protectedPrefix.length,
                  protectedPrefix.length,
                );
              }
            }, 0);
          } else {
            input.setSelectionRange(
              protectedPrefix.length,
              Math.max(protectedPrefix.length, selectionEnd),
            );
          }
        } else if (
          selectionStart === protectedPrefix.length &&
          selectionEnd === protectedPrefix.length
        ) {
          if (e.key === "Backspace") {
            e.preventDefault();
          }
        }
      }
    },
    [protectedPrefix, externalOnChange],
  );

  return (
    <Input {...props} value={displayValue} onChange={handleChange} onKeyDown={handleKeyDown} />
  );
};
