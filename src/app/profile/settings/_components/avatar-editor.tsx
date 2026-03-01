"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui-lab/Button";


import styles from "./avatar-editor.module.css";

interface AvatarEditorProps {
  image: string;
  onCancel: () => void;
  onSave: (blob: Blob) => void;
}

export const AvatarEditor = ({
  image,
  onCancel,
  onSave,
}: AvatarEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Загружаем изображение
  useEffect(() => {
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = image;
    img.onload = () => {
      setImageObj(img);
      setImageLoaded(true);
      // Центрируем изображение
      const canvas = canvasRef.current;
      if (canvas) {
        const centerX = (canvas.width - img.width) / 2;
        const centerY = (canvas.height - img.height) / 2;
        setPosition({ x: centerX, y: centerY });
      }
    };
  }, [image]);

  // Рисуем на canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imageObj || !imageLoaded) return;

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем изображение с учетом масштаба и позиции
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);
    ctx.drawImage(imageObj, 0, 0);
    ctx.restore();

    // Рисуем круглую маску (затемнение вне круга)
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Вырезаем круг в центре
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 20;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Рисуем обводку круга
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }, [imageObj, imageLoaded, position, scale]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;

    // Создаем новый canvas для финального изображения
    const finalCanvas = document.createElement("canvas");
    const size = 512; // Размер финального изображения
    finalCanvas.width = size;
    finalCanvas.height = size;
    const ctx = finalCanvas.getContext("2d");
    if (!ctx) return;

    // Вычисляем параметры обрезки
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 20;

    // Вычисляем область обрезки
    const sourceX = (centerX - radius - position.x) / scale;
    const sourceY = (centerY - radius - position.y) / scale;
    const sourceSize = (radius * 2) / scale;

    // Рисуем обрезанное изображение в круг
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      imageObj,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      size,
      size,
    );

    // Конвертируем в blob
    finalCanvas.toBlob(
      (blob) => {
        if (blob) {
          onSave(blob);
        }
      },
      "image/jpeg",
      0.95,
    );
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Редактирование фото</h2>

        <div className={styles.editor}>
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            height={400}
            width={400}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
          />

          <div className={styles.controls}>
            <label className={styles.controlLabel}>
              <span>Масштаб</span>
              <input
                className={styles.slider}
                max="3"
                min="0.5"
                step="0.1"
                type="range"
                value={scale}
                onChange={(e) => setScale(Number.parseFloat(e.target.value))}
              />
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="button" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};
