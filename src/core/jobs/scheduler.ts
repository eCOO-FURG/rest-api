// Entities
import { Job } from "@/core/entities/job";

export interface Scheduler {
  schedule(job: Job): Promise<void>;
}
