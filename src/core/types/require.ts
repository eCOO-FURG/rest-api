export type Require<T, K extends keyof T> = Pick<T, K> & Required<T>;
