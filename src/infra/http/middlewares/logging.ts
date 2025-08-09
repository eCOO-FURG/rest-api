// Libs
import { NextFunction, Request, Response } from "express";

// Entities
import { UUID } from "@/core/entities/aggregates/uuid";

// Utils
import { isEmpty } from "@/infra/utils/is-empty";

let count = 0;

export function logging() {
  return async (request: Request, response: Response, next: NextFunction) => {
    const start = Date.now();
    const send = response.send;

    let responseBody: Record<string, unknown> | string;

    response.send = function (body: Record<string, unknown> | string) {
      responseBody = body;
      return send.call(this, body);
    };

    response.on("finish", () => {
      const took = Date.now() - start;
      const time = new Date().toISOString();

      console.log(
        "%s \x1b[32m%s\x1b[0m (%s): \x1b[36m%s\x1b[0m",
        `\n[${time}]`,
        "INFO",
        `${++count}`,
        "request completed",
        {
          id: new UUID().value,
          ...(request.user_id && { user_id: request.user_id }),
          request: {
            method: request.method,
            url: request.url,
            ...(!isEmpty(request.query) && { query: request.query }),
            ...(!isEmpty(request.body) && {
              body: JSON.parse(JSON.stringify(request.body)),
            }),
          },
          response: {
            status: response.statusCode,
            ...(!isEmpty(responseBody) && {
              body: JSON.parse(JSON.stringify(responseBody)),
            }),
          },
          took: `${took}ms`,
        },
      );
    });

    next();
  };
}
