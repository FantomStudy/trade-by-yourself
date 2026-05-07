"use client";

import { PhoneIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";

interface PhoneButtonProps {
  phoneNumber: string;
}

export const PhoneButton = ({ phoneNumber }: PhoneButtonProps) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <Button onClick={() => setIsShow((prev) => !prev)}>
      <PhoneIcon />
      {isShow && phoneNumber ? phoneNumber : "Показать номер"}
    </Button>
  );
};
