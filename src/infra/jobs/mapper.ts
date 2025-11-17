// Entities
import { Job } from "@/core/entities/job";

// Container
import container from "@/infra/container";

export const mapper: Record<Job["name"], (params: Job["params"]) => Promise<void>> = {
  "publish-cycle-on-market": (params) =>
    container.resolve("publishCycleOnMarketJob").execute(params),
};
