// Libraries
import Joi from "joi";

const schema = Joi.object({
  // Environment
  ENVIRONMENT: Joi.string()
    .valid("PRODUCTION", "STAGING", "DEVELOPMENT")
    .required(),

  // Server
  SERVER_PORT: Joi.string().required(),
  SERVER_URL: Joi.string().required(),

  // WebSocket
  WS_URL: Joi.string().required(),

  // Integrations
  INTEGRATIONS_AUTHORIZATION: Joi.string(),

  // Email
  EMAIL_ACCOUNT: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),

  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),

  BATCH_EMAIL_ACCOUNT: Joi.alternatives().conditional("ENVIRONMENT", {
    not: "DEVELOPMENT",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  BATCH_EMAIL_PASSWORD: Joi.alternatives().conditional("ENVIRONMENT", {
    not: "DEVELOPMENT",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

  BATCH_SMTP_HOST: Joi.string().required(),
  BATCH_SMTP_PORT: Joi.number().required(),

  FALLBACK_EMAIL_ACCOUNT: Joi.alternatives().conditional("ENVIRONMENT", {
    not: "DEVELOPMENT",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

  FALLBACK_EMAIL_PASSWORD: Joi.alternatives().conditional("ENVIRONMENT", {
    not: "DEVELOPMENT",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

  FALLBACK_SMTP_HOST: Joi.alternatives().conditional("ENVIRONMENT", {
    not: "DEVELOPMENT",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

  // Auth
  JWT_SECRET: Joi.string().required(),

  // Storage
  STORAGE_URL: Joi.string().required(),

  // Logs
  SENTRY_DSN: Joi.alternatives().conditional("ENVIRONMENT", {
    not: "DEVELOPMENT",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

  // Cache
  CACHE_URL: Joi.string().required(),

  // Database
  DATABASE_URL: Joi.string().required(),

  // App
  APP_URL: Joi.string().required(),

  // Payments
  PIX_PROVIDER_API_KEY: Joi.alternatives().conditional("ENVIRONMENT", {
    not: "DEVELOPMENT",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

  // LLM
  OPENAI_API_KEY: Joi.string().required(),
})
  .unknown(true)
  .required();

const { error, value } = schema.validate(process.env);

if (error) {
  console.log(`❌ Variável ambiente ${error.details[0].path} não encontrada.`);
  process.exit(1);
}

export const env = value as Joi.extractType<typeof schema>;
