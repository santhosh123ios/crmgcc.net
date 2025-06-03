// cropUtils.js
export const getCroppedImg = (imageSrc, pixelCrop, fileName) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        const file = new File([blob], `${fileName}.jpg`, { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    };
    image.onerror = (e) => reject(e);
  });
};