"use client";

import type {
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";

import { useCallback } from "react";
import { useController } from "react-hook-form";

import { formatPhoneNumber, getCleanPhoneForSubmit } from "@/lib/phone";

interface UsePhoneFieldOptions<T extends FieldValues, K extends FieldPath<T>>
  extends UseControllerProps<T, K> {
  /**
   * Если true, то значение в форме будет храниться в чистом виде (+7xxxxxxxxxx)
   * Если false, то в отформатированном (+7 (XXX) XXX-XX-XX)
   */
  storeCleanValue?: boolean;
}

export function usePhoneField<T extends FieldValues, K extends FieldPath<T>>({
  storeCleanValue = false,
  ...controllerProps
}: UsePhoneFieldOptions<T, K>) {
  const {
    field: { value, onChange, onBlur, name, ref },
    fieldState: { error },
  } = useController(controllerProps);

  const handleChange = useCallback(
    (formattedValue: string) => {
      // Обновляем значение в форме
      if (storeCleanValue) {
        // Сохраняем в чистом виде
        const cleanValue = getCleanPhoneForSubmit(formattedValue);
        onChange(cleanValue);
      } else {
        // Сохраняем в отформатированном виде
        onChange(formattedValue);
      }
    },
    [onChange, storeCleanValue],
  );

  // Всегда показываем отформатированную версию значения
  const displayValue = formatPhoneNumber(value || "");

  const handleBlur = useCallback(() => {
    onBlur();
  }, [onBlur]);

  return {
    name,
    ref,
    value: displayValue,
    onChange: handleChange,
    onBlur: handleBlur,
    error: error?.message,
  };
}
