// Libraries
import { asFunction, AwilixContainer } from "awilix";

// Jobs
import { PublishCycleOnMarketJob } from "@/core/jobs/publish-cycle-on-market";

export default (container: AwilixContainer) => {
  container.register({
    publishCycleOnMarketJob: asFunction(
      ({ offersRepository }) => new PublishCycleOnMarketJob(offersRepository),
    ),
  });
};
