// Libs
import { asFunction, AwilixContainer } from "awilix";

// Events
import { OnRegisteredEvent } from "@/core/events/on-registered";
import { OnOtpRequestEvent } from "@/core/events/on-otp-request";

export default (container: AwilixContainer) => {
  container.register({
    onRegisteredEvent: asFunction(
      ({ mailer, hasher }) => new OnRegisteredEvent(mailer, hasher)
    ),
    onOtpRequestEvent: asFunction(
      ({ usersRepository, mailer }) =>
        new OnOtpRequestEvent(usersRepository, mailer)
    ),
  });
};
