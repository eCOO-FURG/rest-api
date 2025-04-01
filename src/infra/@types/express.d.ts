// Entities
import { UserRole } from "@/core/entities/user";

declare global {
  namespace Express {
    interface Request {
      user_id: string;
      farm_id: string;
      admin: boolean;
      files: Record<string, Express.Multer.File[]>;
      roles: UserRole[];
    }
  }
}
