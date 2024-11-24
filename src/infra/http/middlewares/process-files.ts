// Libraries
import multer, { MulterError } from "multer";

const FIVE_MEGABYTES = 5 * 1024 * 1024;

interface ProcessFileOptions {
  allowed?: string[];
  size?: number;
  max?: number;
}

function config(
  { size, allowed, max }: ProcessFileOptions,
  field: string
): multer.Options {
  return {
    storage: multer.memoryStorage(),
    limits: { fileSize: size ?? FIVE_MEGABYTES, files: max ?? 5 },
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
