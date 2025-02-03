// Types
import { File } from "@/core/types/file";

type ToFileReturn<T> = T extends Express.Multer.File[]
  ? File[]
  : T extends Express.Multer.File
  ? File
  : undefined;

export function toFile<
  T extends Express.Multer.File | Express.Multer.File[] | undefined
>(file: T): ToFileReturn<T> {
  if (!file) return undefined as ToFileReturn<T>;

  if (Array.isArray(file)) {
    return file.map((f) => ({
      name: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      content: f.buffer,
    })) as ToFileReturn<T>;
  }

  return {
    name: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    content: file.buffer,
  } as ToFileReturn<T>;
}
