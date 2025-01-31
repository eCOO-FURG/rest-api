import { MAGIC_NUMBERS, MagicNumberResponse } from "@/core/constants/magic-numbers";

export const getFileInfoFromBuffer = (buffer: Buffer): MagicNumberResponse => {
  const hexSignature = buffer.subarray(0, 8).toString("hex").toUpperCase();

  for (const [signature, info] of Object.entries(MAGIC_NUMBERS)) {
    if (hexSignature.startsWith(signature)) {
      return info;
    }
  }

  return { mime: "application/octet-stream", ext: "bin" };
};