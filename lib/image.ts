// Client-side image downscale. Phone photos are often several MB, which is slow
// to upload and can exceed the serverless request-body limit; shrinking to a
// catalog-appropriate size before upload keeps things fast and reliable. Falls
// back to the original file if anything goes wrong (e.g. an undecodable format).
export async function resizeImageFile(
  file: File,
  maxDim = 1600,
  quality = 0.85
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not decode image"));
      image.src = dataUrl;
    });

    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
    // Already small enough — don't re-encode and risk quality loss.
    if (scale === 1 && file.size < 1_500_000) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob) return file;

    return new File([blob], "photo.jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
