// Libs
import { asFunction, AwilixContainer } from "awilix";

// Events
import { OnRegisteredEvent } from "@/core/events/on-registered";
import { OnOtpRequestEvent } from "@/core/events/on-otp-requested";
import { OnUpdatePasswordRequestEvent } from "@/core/events/on-password-update-requested";
import { OnRequestHelpEvent } from "@/core/events/on-request-help";

export default (container: AwilixContainer) => {
  container.register({
    onRegisteredEvent: asFunction(
      ({ mailer, hasher }) => new OnRegisteredEvent(mailer, hasher)
    ),
    onOtpRequestEvent: asFunction(
      ({ usersRepository, mailer }) =>
        new OnOtpRequestEvent(usersRepository, mailer)
    ),
    onUpdatePasswordRequestEvent: asFunction(
      ({ usersRepository, hasher, mailer }) =>
        new OnUpdatePasswordRequestEvent(usersRepository, hasher, mailer)
    ),
    onRequestHelpEvent: asFunction(
      ({ mailer }) => 
        new OnRequestHelpEvent(mailer)
    )
  });
};
