const PATTERNS: Record<string, RegExp> = {
  _: /\d/,
  "#": /[a-z]/i,
  "*": /[a-z0-9]/i,
};

export const getProtectedPrefix = (mask: string): string => {
  let prefix = "";

  for (let i = 0; i < mask.length; i++) {
    const char = mask[i];
    if (char in PATTERNS) {
      break;
    }
    prefix += char;
  }

  return prefix;
};

export const applyMask = (
  value: string,
  mask: string,
  protectedPrefix?: string,
) => {
  const prefix = protectedPrefix || getProtectedPrefix(mask);
  let result = prefix;
  let valueIndex = 0;
  let maskIndex = prefix.length;

  while (valueIndex < value.length && maskIndex < mask.length) {
    const maskChar = mask[maskIndex];

    if (maskChar in PATTERNS) {
      const valueChar = value[valueIndex];
      if (PATTERNS[maskChar].test(valueChar)) {
        result += valueChar;
        valueIndex++;
      } else {
        break;
      }
      maskIndex++;
    } else {
      if (valueIndex < value.length) {
        result += maskChar;
      }

      maskIndex++;
    }
  }

  return result;
};

export const extractValue = (value: string, mask: string): string => {
  let result = "";
  let valueIndex = 0;
  let maskIndex = 0;

  while (maskIndex < mask.length && valueIndex < value.length) {
    const maskChar = mask[maskIndex];
    const valueChar = value[valueIndex];

    if (maskChar in PATTERNS) {
      if (PATTERNS[maskChar].test(valueChar)) {
        result += valueChar;
        valueIndex++;
      }
      maskIndex++;
    } else {
      if (valueChar === maskChar) {
        valueIndex++;
      }
      maskIndex++;
    }
  }

  return result;
};
