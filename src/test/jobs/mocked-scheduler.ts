// Entities
import { Job } from "@/core/entities/job";

// Jobs
import { Scheduler } from "@/core/jobs/scheduler";

export class MockedScheduler implements Scheduler {
  public jobs: Job[] = [];

  async schedule(job: Job) {
    this.jobs.push(job);
  }
}
