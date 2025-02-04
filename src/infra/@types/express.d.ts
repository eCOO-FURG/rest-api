declare module Express {
  export interface Request {
    user_id: string;
    farm_id: string;
    files: Record<string, Express.Multer.File[]>;
  }
}
