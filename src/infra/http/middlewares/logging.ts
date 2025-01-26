import { NextFunction, Request, Response, RequestHandler } from "express";

export const loggingMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  console.log(`INCOMING REQUEST: ${req.method} ${req.originalUrl}`, {
    body: req.body,
    query: req.query,
  });

  const originalSend = res.send;
  const responseChunks: any[] = [];

  res.send = function (this: Response, body?: any) {
    if (typeof body === "string") {
      responseChunks.push(Buffer.from(body));
    } else if (Buffer.isBuffer(body)) {
      responseChunks.push(body);
    } else {
      responseChunks.push(Buffer.from(JSON.stringify(body)));
    }
    return originalSend.call(this, body);
  };

  res.on("finish", () => {
    const body = Buffer.concat(responseChunks).toString("utf8");
    const took = Date.now() - startTime;
    console.log(
      `OUTGOING RESPONSE: ${req.method} ${req.originalUrl} [${res.statusCode}] - ${took}ms`,
      {
        body,
        took,
      }
    );
  });

  next();
};
