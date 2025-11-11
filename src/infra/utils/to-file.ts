// Types
import { File } from "@/core/types/file";

// Validation
import { JoiFile } from "@/infra/http/validation/file";

type ToFileReturn<T> = T extends JoiFile[] ? File[] : T extends JoiFile ? File : undefined;

export function toFile<T extends JoiFile | JoiFile[] | undefined>(file: T): ToFileReturn<T> {
  if (!file) {
    return undefined as ToFileReturn<T>;
  }

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
