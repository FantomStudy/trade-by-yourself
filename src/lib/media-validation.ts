"use client";

export const MAX_IMAGE_FILE_SIZE_MB = 10;
export const MAX_TOTAL_IMAGE_SIZE_MB = 80;
export const MIN_IMAGE_ASPECT_RATIO = 0.4;
export const MAX_IMAGE_ASPECT_RATIO = 2.5;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const bytesToMb = (bytes: number) => bytes / (1024 * 1024);

const readImageSize = (file: File): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };

    image.onerror = () => {
      reject(new Error("Не удалось прочитать изображение"));
      URL.revokeObjectURL(url);
    };

    image.src = url;
  });

interface ValidateImagesOptions {
  currentCount?: number;
  currentTotalBytes?: number;
  maxFiles?: number;
}

export async function validateImageFiles(
  files: File[],
  options: ValidateImagesOptions = {},
): Promise<string | null> {
  const { currentCount = 0, currentTotalBytes = 0, maxFiles = 8 } = options;

  if (currentCount + files.length > maxFiles) {
    return `Можно загрузить не более ${maxFiles} фото.`;
  }

  const totalBytes =
    currentTotalBytes + files.reduce((sum, file) => sum + file.size, 0);
  if (bytesToMb(totalBytes) > MAX_TOTAL_IMAGE_SIZE_MB) {
    return `Общий размер фото слишком большой. Допустимо до ${MAX_TOTAL_IMAGE_SIZE_MB} МБ на объявление.`;
  }

  for (const file of files) {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return "Допустимы только JPG, PNG или WebP.";
    }

    if (bytesToMb(file.size) > MAX_IMAGE_FILE_SIZE_MB) {
      return `Файл "${file.name}" слишком большой. Допустимо до ${MAX_IMAGE_FILE_SIZE_MB} МБ на одно фото.`;
    }

    const { width, height } = await readImageSize(file);
    if (!width || !height) {
      return `Не удалось определить размер фото "${file.name}".`;
    }

    const ratio = width / height;
    if (ratio < MIN_IMAGE_ASPECT_RATIO || ratio > MAX_IMAGE_ASPECT_RATIO) {
      return `Фото "${file.name}" имеет неподходящее соотношение сторон. Рекомендуется от 1:2.5 до 2.5:1.`;
    }
  }

  return null;
}

export function getUploadErrorMessage(error: any, fallback: string): string {
  const status = error?.response?.status ?? error?.status;
  const responseMessage =
    error?.response?._data?.message ??
    error?.response?.data?.message ??
    error?.data?.message;

  if (status === 413) {
    return `Файлы слишком большие для загрузки. Уменьшите размер фото: до ${MAX_IMAGE_FILE_SIZE_MB} МБ на одно фото и до ${MAX_TOTAL_IMAGE_SIZE_MB} МБ на объявление.`;
  }

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  return fallback;
}
