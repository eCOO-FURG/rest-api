export type Page<T> = {
  total: number;
  size: number;
  page: number;
  data: T[];
};
