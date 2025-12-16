"use client";

import type { LinkProps } from "next/link";

import Link from "next/link";
import { useState } from "react";

export const LinkComponent = ({ children, ...props }: LinkProps<unknown>) => {
  const [active, setActive] = useState(false);

  return (
    <Link
      {...props}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  );
};
