// Libraries
import multer, { MulterError } from "multer";

// Utils
import { toMb } from "@/infra/utils/to-mb";

interface ProcessFileOptions {
  allowed?: string[];
  size?: number;
  max?: number;
}

function config(
  { size, allowed, max }: ProcessFileOptions,
  field: string
): multer.Options {
  const fileSize = toMb(size ?? 5);

  return {
    storage: multer.memoryStorage(),
    limits: { fileSize, files: max ?? 5 },
    fileFilter: (_, file, callback) => {
      const ok = !allowed || allowed.includes(file.mimetype);

      if (ok) return callback(null, true);

      callback(new MulterError("LIMIT_UNEXPECTED_FILE", field));
    },
  };
}

export function processFile(field: string, options: ProcessFileOptions) {
  return multer(config(options, field)).single(field);
}

export function processFiles(field: string, options: ProcessFileOptions) {
  return multer(config(options, field)).array(field, options.max);
}
