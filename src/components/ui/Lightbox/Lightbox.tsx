/* eslint-disable @next/next/no-img-element */
"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface LightboxProps {
  /** Либо массив картинок, либо одна картинка строкой */
  images?: string[];
  image?: string | null;
  initialIndex?: number;
  alt?: string;
  onClose: () => void;
}

export const Lightbox = ({
  images: imagesProp,
  image,
  initialIndex = 0,
  alt = "Изображение",
  onClose,
}: LightboxProps) => {
  const images = imagesProp && imagesProp.length > 0 ? imagesProp : image ? [image] : [];
  const [idx, setIdx] = useState(Math.min(initialIndex, Math.max(0, images.length - 1)));
  const total = images.length;

  const prev = useCallback(() => {
    setIdx((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  const next = useCallback(() => {
    setIdx((i) => (i === total - 1 ? 0 : i + 1));
  }, [total]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
      if (total > 1) {
        if (e.key === "ArrowLeft") {
          e.stopPropagation();
          prev();
        }
        if (e.key === "ArrowRight") {
          e.stopPropagation();
          next();
        }
      }
    };
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [onClose, prev, next, total]);

  // Блокируем скролл страницы при открытом лайтбоксе
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (typeof document === "undefined" || total === 0) return null;

  const src = images[idx];

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Затемняющий фон */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.9)",
          backdropFilter: "blur(4px)",
          cursor: "zoom-out",
        }}
      />

      {/* Изображение */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "92vw",
          maxHeight: "92vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
        }}
      >
        <img
          key={src}
          src={src}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "92vw",
            maxHeight: "92vh",
            objectFit: "contain",
            borderRadius: "8px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          }}
        />
      </div>

      {/* Счётчик страниц */}
      {total > 1 && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            borderRadius: "9999px",
            padding: "6px 16px",
            fontSize: "14px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 2,
          }}
        >
          {idx + 1} / {total}
        </div>
      )}

      {/* Кнопка закрытия */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        title="Закрыть (Esc)"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "rgba(255, 255, 255, 0.15)",
          border: "none",
          borderRadius: "50%",
          padding: "10px",
          cursor: "pointer",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
        }}
      >
        <X style={{ width: 24, height: 24 }} />
      </button>

      {/* Стрелка влево */}
      {total > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          title="Предыдущее фото"
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255, 255, 255, 0.15)",
            border: "none",
            borderRadius: "50%",
            padding: "12px",
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
          }}
        >
          <ChevronLeft style={{ width: 28, height: 28 }} />
        </button>
      )}

      {/* Стрелка вправо */}
      {total > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          title="Следующее фото"
          style={{
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255, 255, 255, 0.15)",
            border: "none",
            borderRadius: "50%",
            padding: "12px",
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
          }}
        >
          <ChevronRight style={{ width: 28, height: 28 }} />
        </button>
      )}
    </div>,
    document.body,
  );
};
