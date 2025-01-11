export const toBuffer = (images?: Express.Multer.File[]) => {
  if (!images) return [];

  return images.map((image) => image.buffer).filter((buffer) => !!buffer);
};
