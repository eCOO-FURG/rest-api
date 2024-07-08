import { createContainer, AwilixContainer } from "awilix";
import registerRepositories from "./repositories";
import registerServices from "./services";
import registerEvents from "./events";
import registerUseCases from "./use-cases";

const container = createContainer();

registerRepositories(container);
registerServices(container);
registerEvents(container);
registerUseCases(container);

export default container;
