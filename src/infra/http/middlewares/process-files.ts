// Libraries
import multer, { MulterError } from "multer";
import { Request, Response, NextFunction } from "express";

// Utils
import { toMb } from "@/infra/utils/to-mb";

interface ProcessFileOptions {
  allowed?: string[];
  size?: number;
  max?: number;
}

interface FieldConfig {
  name: string;
  options: ProcessFileOptions;
}

function config(fields: FieldConfig[]): multer.Options {
  return {
    storage: multer.memoryStorage(),
    fileFilter: (req, file, callback) => {
      const config = fields.find((f) => f.name === file.fieldname);

      if (!config) return callback(new MulterError("LIMIT_UNEXPECTED_FILE"));

      const files = (req.files?.[file.fieldname] as Express.Multer.File[]) || [];

      if (files.length > (config.options.max ?? 1)) {
        return callback(new MulterError("LIMIT_FILE_COUNT", file.fieldname));
      }

      const ok = !config.options.allowed || config.options.allowed.includes(file.mimetype);

      if (ok) return callback(null, true);

      callback(new MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    },
    limits: {
      fileSize: toMb(Math.max(...fields.map((f) => f.options.size ?? 5))),
    },
  };
}

export function processFiles(fields: FieldConfig[]) {
  const upload = multer(config(fields));

  return [
    upload.fields(
      fields.map(({ name, options }) => ({
        name,
        maxCount: options.max ?? 1,
      })),
    ),
    (req: Request, _: Response, next: NextFunction) => {
      if (req.files) {
        for (const [name, files] of Object.entries(req.files)) {
          const config = fields.find((field) => field.name === name);

          if (!config) continue;

          const max = config.options.max ?? 1;

          req.body[name] = max > 1 ? files : files[0];
        }
      }
      next();
    },
  ];
}
