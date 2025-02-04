// Libraries
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Env
import { env } from "@/infra/env";

Sentry.init({
  dsn: env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

export class Logger {
  static log(error: unknown) {
    if (["production", "staging"].includes(env.ENV)) {
      Sentry.captureException(error);
    } else {
      console.log(error);
    }
  }
}
