// Libraries
import { createContainer } from "awilix";

// Container
import registerRepositories from "@/infra/container/repositories";
import registerServices from "@/infra/container/services";
import registerUseCases from "@/infra/container/use-cases";

const container = createContainer();

registerRepositories(container);
registerServices(container);
registerUseCases(container);

export default container;
