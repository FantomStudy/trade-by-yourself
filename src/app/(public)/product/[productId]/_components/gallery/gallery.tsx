"use client";

import { MoveLeft, MoveRight, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import styles from "./gallery.module.css";

interface GalleryProps {
  images: string[];
  videoUrl?: string | null;
}

const PlayGlyph = () => (
  <svg aria-hidden="true" className={styles.thumbnailIcon} viewBox="0 0 24 24">
    <polygon points="7,4 20,12 7,20" />
  </svg>
);

type VideoSource =
  | { kind: "iframe"; src: string; provider: "vk" | "yandex" | "other" }
  | { kind: "video"; src: string; provider: "direct" }
  | { kind: "external"; src: string; provider: "yandex" };

export const Gallery = ({ images, videoUrl }: GalleryProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const isVkVideoUrl = (url?: string | null) => {
    if (!url) return false;
    return (
      url.includes("vkvideo.ru/video") ||
      url.includes("vk.com/video") ||
      url.includes("vk.com/video_ext.php")
    );
  };

  const getVkEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.includes("video_ext.php")) {
      return url;
    }
    const match = url.match(/video(-?\d+)_(\d+)/);
    if (!match) {
      return null;
    }
    const oid = match[1];
    const id = match[2];
    return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`;
  };
  const isYandexVideoUrl = (url?: string | null) => {
    if (!url) return false;
    return url.includes("yandex.ru/video/preview/");
  };

  const getYandexEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    // Для части ссылок `preview/<id>` id не совпадает с id плеера.
    // Безопаснее встраивать исходный URL, а не насильно конвертировать.
    return url;
  };

  const resolveVideoSource = (url?: string | null): VideoSource | null => {
    if (!url) return null;
    if (isVkVideoUrl(url)) {
      const src = getVkEmbedUrl(url);
      return src ? { kind: "iframe", src, provider: "vk" } : null;
    }
    if (isYandexVideoUrl(url)) {
      const src = getYandexEmbedUrl(url);
      return src ? { kind: "external", src, provider: "yandex" } : null;
    }
    if (/^https?:\/\/.+\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      return { kind: "video", src: url, provider: "direct" };
    }
    // Неизвестный провайдер — пробуем iframe как универсальный вариант.
    return { kind: "iframe", src: url, provider: "other" };
  };

  const slides = videoUrl ? [...images, videoUrl] : images;
  const [currentIndex, setCurrentIndex] = useState(0);
  const resolvedVideo = resolveVideoSource(videoUrl);

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
        {slides.length > 1 ? (
          <div className={styles.thumbnails}>
            {slides.map((slide, index) => {
              const isVideo = Boolean(videoUrl) && index === slides.length - 1;
              return (
                <button
                  key={slide + index}
                  className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ""}`}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                >
                  {isVideo ? (
                    <div className={styles.thumbnailContent}>
                      {resolvedVideo?.kind === "iframe" && resolvedVideo.provider === "vk" ? (
                        <iframe
                          className={styles.videoThumbFrame}
                          src={resolvedVideo.src}
                          title="video thumbnail"
                          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                          frameBorder="0"
                          tabIndex={-1}
                        />
                      ) : (
                        <>
                          <div className={styles.videoThumbFallback}>Видео</div>
                          <PlayGlyph />
                        </>
                      )}
                    </div>
                  ) : (
                    <Image fill alt={slide} src={slide} style={{ objectFit: "cover" }} />
                  )}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className={styles.mainImageWrapper}>
          {videoUrl && currentIndex === slides.length - 1 ? (
            <div className={styles.videoWrapper}>
              {resolvedVideo?.kind === "iframe" ? (
                <>
                  <iframe
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    className={styles.mainImage}
                    src={resolvedVideo.src}
                    title="video"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    frameBorder="0"
                  />
                  {videoUrl ? (
                    <a className={styles.videoSourceLink} href={videoUrl} target="_blank" rel="noreferrer">
                      Открыть видео по ссылке
                    </a>
                  ) : null}
                </>
              ) : resolvedVideo?.kind === "external" ? (
                <div className={styles.videoUnavailable}>
                  <div>
                    Видео недоступно для встраивания
                    <br />
                    Откройте по ссылке
                  </div>
                  <a className={styles.videoSourceLink} href={resolvedVideo.src} target="_blank" rel="noreferrer">
                    Открыть видео по ссылке
                  </a>
                </div>
              ) : resolvedVideo?.kind === "video" ? (
                <video
                  className={styles.mainImage}
                  src={resolvedVideo.src}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  controls
                />
              ) : (
                <div className={styles.videoUnavailable}>Видео недоступно для просмотра</div>
              )}
            </div>
          ) : (
            <Image
              fill
              alt={"thumbnail"}
              className={styles.mainImage}
              src={slides[currentIndex]}
              style={{ cursor: "pointer" }}
              onClick={openFullScreen}
              priority
            />
          )}
          {slides.length > 1 ? (
            <div className={styles.controls}>
              <button className={styles.controlItem} type="button" onClick={prevSlide}>
                <MoveLeft />
              </button>
              <button className={styles.controlItem} type="button" onClick={nextSlide}>
                <MoveRight />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {isFullScreen && !videoUrl && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
          onClick={closeFullScreen}
        >
          <button
            className="absolute top-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            type="button"
            onClick={closeFullScreen}
          >
            <X className="h-6 w-6" />
          </button>

          {slides.length > 1 && (
            <>
              <button
                className="absolute top-1/2 left-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
              >
                <MoveLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute top-1/2 right-4 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
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

          {slides.length > 1 && (
            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((slide, index) => (
                <button
                  key={`fullscreen-dot-${slide}-${index}`}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
                  }`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
