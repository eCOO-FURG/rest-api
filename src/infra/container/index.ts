// Libraries
import { createContainer } from "awilix";

// Container
import registerRepositories from "@/infra/container/repositories";
import registerServices from "@/infra/container/services";
import registerUseCases from "@/infra/container/use-cases";
import registerJobs from "@/infra/container/jobs";

const container = createContainer();

registerRepositories(container);
registerServices(container);
registerUseCases(container);
registerJobs(container);

export default container;
