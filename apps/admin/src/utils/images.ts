/**
 * Turns a blob: URL from a file picker into a JPEG data URL no larger than `max` px on the long side,
 * so product photos stay small enough for the API and Telegram. data: and http(s) URLs pass through.
 */
export async function toCompressedDataUrl(url: string, max = 800): Promise<string> {
  if (!url.startsWith('blob:')) return url;
  const blob = await (await fetch(url)).blob();
  return new Promise<string>((resolve, reject) => {
    const img = new window.Image();
    const imgUrl = URL.createObjectURL(blob);
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > h && w > max) {
        h *= max / w;
        w = max;
      } else if (h > max) {
        w *= max / h;
        h = max;
      }
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(imgUrl);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = () => {
      URL.revokeObjectURL(imgUrl);
      reject(new Error('Image could not be loaded'));
    };
    img.src = imgUrl;
  });
}
