import Link from "next/link";

import { Button, Logo } from "@/components/ui";

export const Footer = () => {
  return (
    <footer className="bg-background mt-32">
      <div className="global-container">
        <div className="flex items-center justify-between py-10">
          <Logo />
          <nav className="flex items-center gap-6">
            <Link href="/">Разместить объявление</Link>
            <Link href="/">Правила</Link>
            <Link href="/">Политика конфиденциальности</Link>
            <Button variant="secondary">Тех поддержка</Button>
          </nav>
        </div>
      </div>
      <p className="border-t py-2 text-center">
        ©ТоргуйСам - сайт объявлений 2025
      </p>
    </footer>
  );
};
