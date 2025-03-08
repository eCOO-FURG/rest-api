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

  SMTP_HOST: Joi.alternatives().conditional("ENVIRONMENT", {
    is: "DEVELOPMENT",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

  SMTP_PORT: Joi.alternatives().conditional("ENVIRONMENT", {
    is: "DEVELOPMENT",
    then: Joi.number().required(),
    otherwise: Joi.number().optional(),
  }),

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

  // Auth
  JWT_SECRET: Joi.alternatives().conditional("ENVIRONMENT", {
    not: "DEVELOPMENT",
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

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
})
  .unknown(true)
  .required();

const { error, value } = schema.validate(process.env);

if (error) {
  console.log(`❌ Variável ambiente ${error.details[0].path} não encontrada.`);
  process.exit(1);
}

export const env = value as Joi.extractType<typeof schema>;
