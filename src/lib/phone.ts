const PHONE_REGEX = /^\+7\d{10}$/;

export const isValidPhone = (phone: string) => {
  return PHONE_REGEX.test(phone);
};

export const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (!digits) {
    return "";
  }

  if (digits.startsWith("8")) {
    return `+7${digits.slice(1, 11)}`;
  }

  if (digits.startsWith("7")) {
    return `+${digits.slice(0, 11)}`;
  }

  return `+7${digits.slice(0, 10)}`;
};

export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (!digits) {
    return "";
  }

  if (digits.length === 1) {
    return "+7";
  }

  if (digits.length <= 4) {
    return `+7 (${digits.slice(1)}`;
  }

  if (digits.length <= 7) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  }

  if (digits.length <= 9) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
};
