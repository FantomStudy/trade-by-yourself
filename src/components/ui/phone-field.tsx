"use client";

import type { ChangeEvent, KeyboardEvent } from "react";

import { useImperativeHandle, useRef } from "react";

import { Field } from "@/components/ui";
import { formatPhoneNumber, getNewCursorPosition } from "@/lib/phone";

interface PhoneFieldProps {
  name?: string;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  ref?: React.Ref<HTMLInputElement>;
  value?: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
}

export const PhoneField = ({
  disabled,
  error,
  name,
  onBlur,
  onChange,
  placeholder = "+7 (___) ___-__-__",
  ref,
  value = "",
}: PhoneFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Предоставляем доступ к внутреннему input через ref
  useImperativeHandle(ref, () => inputRef.current!);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;

    // Если поле полностью очищено, разрешаем это
    if (inputValue === "") {
      onChange?.("");
      return;
    }

    // Особый случай: если пользователь вводит "8" как первый символ после "+7"
    if (inputValue === "+78" && value === "+7") {
      // Заменяем на "+7" (удаляем введенную 8)
      onChange?.("+7");

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(2, 2);
        }
      }, 0);
      return;
    }

    // Если поле не начинается с +7, но содержит цифры, добавляем +7
    if (!inputValue.startsWith("+7") && inputValue.length > 0) {
      const formatted = formatPhoneNumber(inputValue);
      onChange?.(formatted);

      setTimeout(() => {
        if (inputRef.current) {
          const newPos = Math.max(2, formatted.length);
          inputRef.current.setSelectionRange(newPos, newPos);
        }
      }, 0);
      return;
    }

    const formatted = formatPhoneNumber(inputValue);
    const newCursorPosition = getNewCursorPosition(
      value,
      formatted,
      cursorPosition,
    );

    onChange?.(formatted);

    // Устанавливаем новую позицию курсора после форматирования
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition,
        );
      }
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const currentValue = input.value;

    // Особый случай: если пользователь нажимает "8" в позиции 2 (после "+7")
    if (e.key === "8" && cursorPosition === 2 && currentValue === "+7") {
      // Предотвращаем ввод "8" и оставляем только "+7"
      e.preventDefault();
      return;
    }

    if (e.key === "Backspace") {
      // Если курсор в позиции 2 (после "+7") и пытаемся удалить последний символ из "+7"
      if (cursorPosition === 2 && currentValue === "+7") {
        // Разрешаем очистить поле полностью
        onChange?.("");
        e.preventDefault();
        return;
      }

      // Предотвращаем удаление символов из "+7" если есть другие символы
      if (cursorPosition <= 2 && currentValue.length > 2) {
        e.preventDefault();
        return;
      }
    }

    if (e.key === "Delete") {
      // Предотвращаем удаление "+7" через Delete
      if (cursorPosition < 2) {
        e.preventDefault();
      }
    }
  };

  const handleFocus = () => {
    // Если поле пустое, устанавливаем базовое значение +7
    if (!value) {
      onChange?.("+7");

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(2, 2); // Ставим курсор после +7
        }
      }, 0);
    } else if (value === "+7") {
      // Если поле содержит только +7, ставим курсор в конец
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(2, 2);
        }
      }, 0);
    }
  };

  return (
    <Field
      ref={inputRef}
      disabled={disabled}
      maxLength={18} // +7 (XXX) XXX-XX-XX = 18 символов
      name={name}
      type="tel"
      value={value}
      error={error}
      onBlur={onBlur}
      onChange={handleChange}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
    />
  );
};
