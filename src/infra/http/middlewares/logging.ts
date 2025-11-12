// Libraries
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
        `[${time}]`,
        "INFO",
        `${++count}`,
        "request completed",
        {
          id: new UUID().value,
          user_id: request.user_id ? request.user_id : null,
          request: {
            method: request.method,
            url: request.url,
            query: isEmpty(request.query) ? null : request.query,
            params: isEmpty(request.params) ? null : JSON.parse(JSON.stringify(request.params)),
          },
          response: {
            status: response.statusCode,
            body: isEmpty(responseBody) ? null : JSON.parse(JSON.stringify(responseBody)),
          },
          took: `${took}ms`,
        },
        "\n",
      );
    });

    next();
  };
}
