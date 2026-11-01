"use client";

import { Headset } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SupportHelpModal } from "./support-help-modal";

export const SupportHelpWidget = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Не показываем плавающий виджет на страницах сообщений и чатов, где он закрывает поле ввода
  if (pathname?.startsWith("/profile/messages")) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        aria-label="Служба поддержки и помощь"
        title="Служба поддержки и помощь"
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-3.5 py-2.5 text-xs font-semibold text-emerald-800 shadow-lg backdrop-blur transition-all duration-200 hover:scale-105 hover:bg-emerald-50 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:bottom-6 sm:right-6 sm:px-4 sm:py-3 sm:text-sm"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
        </span>
        <Headset className="h-4 w-4 text-emerald-600 sm:h-5 sm:w-5" />
        <span className="hidden xs:inline">Нужна помощь?</span>
      </button>

      <SupportHelpModal open={open} onOpenChange={setOpen} />
    </>
  );
};
