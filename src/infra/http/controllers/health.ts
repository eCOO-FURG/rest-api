// Libraries
import { NextFunction, Request, Response } from "express";

export async function healthController(_: Request, response: Response, next: NextFunction) {
  try {
    return response.status(200).send({ status: "ok" });
  } catch (error) {
    next(error);
  }
}
