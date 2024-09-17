// Libraries
import { ZodTypeAny } from "zod";

interface Schema {
  route?: ZodTypeAny;
  query?: ZodTypeAny;
  body?: ZodTypeAny;
}

export class SwaggerMapper {
  static toDocs({ body, query, route }: Schema) {
    const docs = {};

    if (body) Object.assign(docs, SwaggerMapper.parseBody(body));

    if (route) Object.assign(docs, { requestParams: { path: route } });

    if (query) Object.assign(docs, { requestParams: { query } });

    return docs;
  }

  private static parseBody(body: ZodTypeAny) {
    return {
      requestBody: {
        content: {
          "application/json": { schema: body },
        },
      },
    };
  }
}
