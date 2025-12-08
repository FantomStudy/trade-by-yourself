"use client";
import { MoveLeft, MoveRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import styles from "./gallery.module.css";

interface GalleryProps {
  images: string[];
  videoUrl?: string | null;
}

export const Gallery = ({ images, videoUrl }: GalleryProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  // Проверка валидности embed-URL VK
  function isValidVkEmbedUrl(url?: string | null) {
    if (!url) return false;
    // embed-URL должен содержать video_ext.php и параметры oid, id
    return (
      url.includes("video_ext.php") &&
      url.includes("oid=") &&
      url.includes("id=")
    );
  }
  // Преобразуем vkvideo.ru ссылку в embed-URL для VK
  function getVkEmbedUrl(url?: string | null) {
    if (!url) return url;
    // Пример: https://vkvideo.ru/video-211504825_456242980
    const match = url.match(/video-?(\d+)_(\d+)/);
    if (match) {
      const oid = match[1].startsWith("-") ? match[1] : `-${match[1]}`;
      const id = match[2];
      // embed-URL без hash
      return `https://vk.com/video_ext.php?oid=${oid}&id=${id}`;
    }
    return url;
  }

  // Формируем массив слайда: сначала изображения, потом видео, если оно есть
  const slides = videoUrl ? [...images, videoUrl] : images;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Подробное логирование состояния галереи
  console.log("[Gallery] videoUrl:", videoUrl);
  console.log("[Gallery] slides:", slides);
  console.log("[Gallery] currentIndex:", currentIndex);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const openFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  return (
    <>
      <div className={styles.imageGallery}>
        {/* Миниатюры слева */}
      {slides.length > 1 ? (
        <div className={styles.thumbnails}>
          {slides.map((slide, index) => {
            const isVideo = videoUrl && index === slides.length - 1;
            return (
              <button
                key={slide + index}
                className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ""}`}
                type="button"
                onClick={() => setCurrentIndex(index)}
              >
                {isVideo ? (
                  <div className={styles.videoThumbnail}>
                    <svg fill="none" height="32" width="32" viewBox="0 0 32 32">
                      <circle
                        cx="16"
                        cy="16"
                        fill="#000"
                        fillOpacity="0.5"
                        r="16"
                      />
                      <polygon fill="#fff" points="13,10 23,16 13,22" />
                    </svg>
                  </div>
                ) : (
                  <Image
                    fill
                    alt={slide}
                    src={slide}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Главное изображение/видео справа */}
      <div className={styles.mainImageWrapper}>
        {videoUrl && currentIndex === slides.length - 1 ? (
          <div className={styles.videoWrapper}>
            {videoUrl.includes("vkvideo.ru") ? (
              (() => {
                const embedUrl = getVkEmbedUrl(videoUrl);
                const valid = isValidVkEmbedUrl(embedUrl);
                console.log("[Gallery] VK video debug:", {
                  originalVideoUrl: videoUrl,
                  embedUrl,
                  valid,
                  currentIndex,
                  slides,
                });
                if (valid) {
                  return (
                    <iframe
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      className={styles.mainImage}
                      src={embedUrl || undefined}
                      title="video"
                      allowFullScreen
                      frameBorder="0"
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                    />
                  );
                } else {
                  return (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#222",
                        color: "#fff",
                        flexDirection: "column",
                        fontSize: "14px",
                      }}
                    >
                      Видео недоступно для просмотра
                      <br />
                      <pre
                        style={{
                          color: "#fff",
                          fontSize: "12px",
                          marginTop: "8px",
                        }}
                      >
                        {JSON.stringify(
                          { videoUrl, embedUrl, valid, currentIndex, slides },
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  );
                }
              })()
            ) : (
              <video
                className={styles.mainImage}
                src={videoUrl}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                controls
              />
            )}
          </div>
        ) : (
          <Image
            fill
            alt={"thumbnail"}
            className={styles.mainImage}
            src={slides[currentIndex]}
            priority
            onClick={openFullScreen}
            style={{ cursor: "pointer" }}
          />
        )}
        {slides.length > 1 ? (
          <div className={styles.controls}>
            <button
              className={styles.controlItem}
              type="button"
              onClick={prevSlide}
            >
              <MoveLeft />
            </button>
            <button
              className={styles.controlItem}
              type="button"
              onClick={nextSlide}
            >
              <MoveRight />
            </button>
          </div>
        ) : null}
      </div>
    </div>

    {/* Полноэкранный просмотр */}
    {isFullScreen && !videoUrl && (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
        onClick={closeFullScreen}
      >
        <button
          className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          onClick={closeFullScreen}
          type="button"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Навигация */}
        {slides.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              type="button"
            >
              <MoveLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              type="button"
            >
              <MoveRight className="h-6 w-6" />
            </button>
          </>
        )}

        <div className="relative h-full w-full p-16">
          <Image
            fill
            alt={slides[currentIndex]}
            className="object-contain"
            src={slides[currentIndex]}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Индикаторы */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={`fullscreen-dot-${slide}-${index}`}
                className={`h-3 w-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                type="button"
              />
            ))}
          </div>
        )}
        </div>
      )}
    </>
  );
};
