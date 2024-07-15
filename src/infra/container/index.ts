// Services
import { createContainer } from "awilix";

// Repositories
import registerRepositories from "@/infra/container/repositories";
import registerServices from "@/infra/container/services";
import registerEvents from "@/infra/container/events";
import registerUseCases from "@/infra/container/use-cases";

const container = createContainer();

registerRepositories(container);
registerServices(container);
registerEvents(container);
registerUseCases(container);

export default container;
