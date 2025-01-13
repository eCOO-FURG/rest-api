// Services
import { Mailer } from "@/core/mail/mailer";
import { Email } from "@/core/entities/email";

// Events
import { DomainEvents } from "@/core/events/domain-events";
import { UUID } from "@/core/entities/aggregates/uuid";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

// Repositories
import { FarmsRepository } from "../repositories/farms-repository";

// Env
import { env } from "@/infra/env";

interface OnRequestHelpEventRequest {
  id: UUID;
  message: string;
}

export class OnRequestHelpEvent {
  constructor(
    private farmsRepository: FarmsRepository,
    private mailer: Mailer
  ) {
    this.setup();
  }

  setup() {
    DomainEvents.register(OnRequestHelpEvent.name, this.execute.bind(this));
  }

  async execute({ id, message }: OnRequestHelpEventRequest) {
    const farm = await this.farmsRepository.find("aggregate", {
      admin: { id: id.value },
    });

    if (!farm) throw new ResourceNotFoundError("Fazenda do usuário", id.value);

    const view = await this.mailer.load({
      view: "request-help",
      props: { message, farm },
    });

    const email = Email.create({
      to: env.ECOO_EMAIL,
      subject: "Solicitação de ajuda | eCOO",
      content: view,
    });

    await this.mailer.send([email]);
  }
}
