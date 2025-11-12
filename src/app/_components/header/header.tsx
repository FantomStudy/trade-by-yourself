import Link from "next/link";

import { Logo } from "@/components/ui";

import { HeaderActions } from "./header-actions";

export const Header = () => {
  return (
    <header className="bg-background">
      <div className="global-container flex h-18 items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        <HeaderActions />
      </div>
    </header>
  );
};
