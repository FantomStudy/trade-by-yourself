const PHONE_REGEX = /^(?:\+7|7|8)\d{10}$/;

export const validatePhone = (phone: string) => {
  return PHONE_REGEX.test(phone);
};
