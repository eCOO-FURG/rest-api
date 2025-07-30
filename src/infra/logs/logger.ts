// Libraries
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Environment
import { env } from "@/infra/env";

Sentry.init({
  dsn: env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  maxValueLength: 10000,
});

export class Logger {
  static log(error: unknown) {
    if (env.ENVIRONMENT === "DEVELOPMENT") {
      console.log(error);
    } else {
      Sentry.captureException(error);
    }
  }
}
