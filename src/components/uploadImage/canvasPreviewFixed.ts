import { PixelCrop } from 'react-image-crop';

export async function canvasPreview(image: HTMLImageElement, canvas: HTMLCanvasElement, crop: PixelCrop) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const size = 500;
  canvas.width = size;
  canvas.height = size;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  ctx.save();
  ctx.drawImage(image, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleX, 0, 0, size, size);  
  ctx.restore();
}
