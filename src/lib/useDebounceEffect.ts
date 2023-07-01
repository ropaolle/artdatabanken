import { useEffect, DependencyList } from 'react';

export function useDebounceEffect(fn: () => void, waitTime: number, deps?: DependencyList) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn.apply(undefined, [...(deps as [])]);
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, deps);
}

// Example
/* useDebounceEffect(
  async () => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current &&
      thumbnailCanvasRef.current
    ) {
      // We use canvasPreview as it's much faster than imgPreview.
      drawImageOnCanvas({
        image: imgRef.current,
        canvas: previewCanvasRef.current,
        crop: completedCrop,
        width: 500,
        height: 500,
      });
    }
  },
  100,
  [completedCrop]
); */
