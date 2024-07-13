// Services
import { asFunction, AwilixContainer } from "awilix";
import { OnRegisteredEvent } from "@/core/events/on-registered";

export default (container: AwilixContainer) => {
  container.register({
    onRegisteredEvent: asFunction(
      ({ mailer, hasher }) => new OnRegisteredEvent(mailer, hasher)
    ),
  });
};
