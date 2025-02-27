// Libraries
import "dotenv/config";
import { z } from "zod";

const deploy = z.object({
  ENV: z.enum(["development", "test", "staging", "production"]),
  SERVER_PORT: z.coerce.number().default(3333),
  SERVER_URL: z.string().min(1),
  FRONT_URL: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  CACHE_MANAGER_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_FALLBACK_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().min(1),
  ECOO_EMAIL: z.string().min(1),
  ECOO_EMAIL_PASSWORD: z.string().min(1),
  ECOO_FALLBACK_EMAIL: z.string().min(1),
  ECOO_FALLBACK_EMAIL_PASSWORD: z.string().min(1),
  SENTRY_DSN: z.string().min(1),
  PIX_PROVIDER_API_KEY: z.string().min(1),
  INTEGRATIONS_AUTHORIZATION: z.string().min(1),
  STORAGE_URL: z.string().min(1),
  WS_URL: z.string().min(1),
});

const development = deploy.omit({
  SENTRY_DSN: true,
  SMTP_FALLBACK_HOST: true,
  ECOO_FALLBACK_EMAIL: true,
  ECOO_FALLBACK_EMAIL_PASSWORD: true,
  PIX_PROVIDER_API_KEY: true,
});

const test = development.omit({
  SMTP_HOST: true,
  SMTP_PORT: true,
  DATABASE_URL: true,
  JWT_SECRET: true,
});

const environment = process.env.ENV;

if (!environment) throw new Error("❌ Ambiente não especificado.");

const schema =
  environment === "staging" || environment === "production"
    ? deploy
    : environment === "development"
    ? development
    : test;

const _env = schema.safeParse(process.env);

if (_env.success === false) {
  const issues = _env.error.issues
    .map((issue) => `${issue.path[0]}: ${issue.fatal}`)
    .join(", ");

  console.log(`❌ Variáveis ambiente incorretas: ${issues}`);

  process.exit(1);
}

export const env = _env.data as z.infer<typeof deploy>;
