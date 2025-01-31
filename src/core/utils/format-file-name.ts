import { getFileInfoFromBuffer } from "./file-info"

export const formatFileName = (filename: string | undefined, buffer: Buffer): string => {
  const { ext } = getFileInfoFromBuffer(buffer);

  if (filename) {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");

    return `${nameWithoutExt}.${ext}`;
  }

  return `arquivo.${ext}`;
};