import { PixelCrop } from 'react-image-crop';

export type CanvasProps = {
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  crop: PixelCrop;
  width: number;
  height: number;
};

export async function drawCanvasPreview({ image, canvas, crop, width, height }: CanvasProps) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = width;
  canvas.height = height;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  ctx.save();
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleX,
    0,
    0,
    width,
    height
  );
  ctx.restore();
}