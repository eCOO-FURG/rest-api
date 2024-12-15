export type View<T extends object> =
  | ({
      [K in keyof T]?: unknown;
    } & {
      [key: string]: unknown;
    })
  | void;
