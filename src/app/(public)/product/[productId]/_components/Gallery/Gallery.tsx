"use client";

import { MoveLeft, MoveRight, PlayIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import styles from "./Gallery.module.css";

interface GalleryProps {
  images: string[];
  videoUrl?: string | null;
}

const isValidVkEmbedUrl = (url?: string | null) => {
  if (!url) return false;
  return url.includes("video_ext.php") && url.includes("oid=") && url.includes("id=");
};

const VK_VIDEO_REGEX = /video-?(\d+)_(\d+)/;

const getVkEmbedUrl = (url?: string | null) => {
  if (!url) return url;

  const match = url.match(VK_VIDEO_REGEX);

  if (!match) return url;

  const oid = match[1].startsWith("-") ? match[1] : `-${match[1]}`;
  const id = match[2];

  return `https://vk.com/video_ext.php?oid=${oid}&id=${id}`;
};

export const Gallery = ({ images, videoUrl }: GalleryProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = videoUrl ? [...images, videoUrl] : images;
  const isVideoSlide = Boolean(videoUrl && currentIndex === slides.length - 1);
  const vkEmbedUrl = videoUrl?.includes("vkvideo.ru") ? getVkEmbedUrl(videoUrl) : null;
  const hasValidVkEmbed = isValidVkEmbedUrl(vkEmbedUrl);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <>
      <div className={styles.imageGallery}>
        {slides.length > 1 ? (
          <div className={styles.thumbnails}>
            {slides.map((slide, index) => {
              const isVideo = Boolean(videoUrl && index === slides.length - 1);

              return (
                <button
                  key={`${slide}-${index}`}
                  className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ""}`}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                >
                  {isVideo ? (
                    <div className={styles.thumbnailContent}>
                      <PlayIcon className={styles.thumbnailIcon} />
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
          {isVideoSlide ? (
            <div className={styles.videoWrapper}>
              {videoUrl?.includes("vkvideo.ru") ? (
                hasValidVkEmbed ? (
                  <iframe
                    className={styles.videoFrame}
                    src={vkEmbedUrl || undefined}
                    title="video"
                    allowFullScreen
                    frameBorder="0"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                  />
                ) : (
                  <div className={styles.videoFallback}>Видео недоступно для просмотра</div>
                )
              ) : (
                <video className={styles.videoFrame} src={videoUrl || undefined} controls />
              )}
            </div>
          ) : (
            <Image
              fill
              alt="Изображение товара"
              className={styles.mainImage}
              src={slides[currentIndex]}
              sizes="(max-width: 768px) 100vw, 650px"
              onClick={() => setIsFullScreen(true)}
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

      {isFullScreen && !isVideoSlide ? (
        <div className={styles.fullscreenOverlay} onClick={() => setIsFullScreen(false)}>
          <button
            className={styles.fullscreenClose}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsFullScreen(false);
            }}
          >
            <X />
          </button>

          {slides.length > 1 ? (
            <>
              <button
                className={`${styles.fullscreenNav} ${styles.fullscreenNavPrev}`}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  prevSlide();
                }}
              >
                <MoveLeft />
              </button>
              <button
                className={`${styles.fullscreenNav} ${styles.fullscreenNavNext}`}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  nextSlide();
                }}
              >
                <MoveRight />
              </button>
            </>
          ) : null}

          <div className={styles.fullscreenImageWrapper}>
            <Image
              fill
              alt={slides[currentIndex]}
              className={styles.fullscreenImage}
              src={slides[currentIndex]}
              onClick={(event) => event.stopPropagation()}
            />
          </div>

          {slides.length > 1 ? (
            <div className={styles.fullscreenDots}>
              {slides.map((slide, index) => (
                <button
                  key={`fullscreen-dot-${slide}-${index}`}
                  className={styles.fullscreenDot}
                  data-active={index === currentIndex || undefined}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};
