"use client";

import { MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getAddressSuggestions, validateAddress } from "@/api/address";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/lab/Dialog";
import { Input } from "@/components/ui/lab/Input";
import styles from "./region-picker.module.css";

interface AddressSuggestion {
  lat?: string;
  lon?: string;
  value: string;
}

interface RegionPickerProps {
  open?: boolean;
  value?: string | null;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (region: string) => void;
}

export const RegionPicker = ({ open, onOpenChange, value, onSelect }: RegionPickerProps) => {
  const [address, setAddress] = useState(value || "");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && value) {
      setAddress(value);
    }
  }, [open, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setValidationError(null);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (newAddress.length > 0) {
      setIsLoadingSuggestions(true);
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const addressSuggestions = await getAddressSuggestions(newAddress);
          setSuggestions(addressSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Ошибка получения подсказок:", error);
        } finally {
          setIsLoadingSuggestions(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingSuggestions(false);
    }
  };

  const handleSuggestionClick = async (suggestion: AddressSuggestion) => {
    setAddress(suggestion.value);
    setShowSuggestions(false);
    setValidationError(null);
  };

  const handleApply = async () => {
    if (!address.trim()) {
      setValidationError("Пожалуйста, выберите регион");
      return;
    }

    try {
      const validationResult = await validateAddress({ address });

      if (validationResult.valid) {
        onSelect?.(address);
        onOpenChange?.(false);
      } else {
        setValidationError(validationResult.message || "Некорректный адрес");
      }
    } catch (error) {
      console.error("Ошибка валидации адреса:", error);
      // В случае ошибки API всё равно применяем адрес
      onSelect?.(address);
      onOpenChange?.(false);
    }
  };

  const handleClear = () => {
    setAddress("");
    setSuggestions([]);
    setValidationError(null);
    onSelect?.("");
    onOpenChange?.(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <Dialog.Content className={styles.dialog}>
        <Dialog.Header>
          <Dialog.Title>Выбор региона</Dialog.Title>
          <Dialog.Description>Укажите регион для поиска товаров</Dialog.Description>
        </Dialog.Header>

        <div className={styles.content}>
          <div ref={suggestionsRef} className={styles.searchSection}>
            <div className={styles.inputWrapper}>
              <Input
                className={styles.input}
                value={address}
                onChange={handleAddressInputChange}
                placeholder="Начните вводить адрес..."
              />
              {address && (
                <button
                  aria-label="Очистить"
                  className={styles.clearButton}
                  type="button"
                  onClick={handleClear}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {isLoadingSuggestions && <div className={styles.loading}>Загрузка подсказок...</div>}

            {showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className={styles.suggestionItem}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <MapPin className={styles.suggestionIcon} size={16} />
                    <span>{suggestion.value}</span>
                  </button>
                ))}
              </div>
            )}

            {validationError && <div className={styles.error}>{validationError}</div>}
          </div>
        </div>

        <Dialog.Footer>
          <Button variant="ghost" onClick={handleClear}>
            Сбросить
          </Button>
          <Button onClick={handleApply}>Применить</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
