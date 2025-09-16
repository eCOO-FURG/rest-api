// Entities
import { WarehouseProps } from "@/core/entities/warehouse";

// Repositories
import { WarehouseRepository } from "@/core/repositories/warehouse-repository";
import { UsersRepository } from "@/core/repositories/users-repository";

// Errors
import { UnauthorizedError } from "@/core/errors/unauthorized";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

interface UpdateWarehouseUseCaseRequest {
  name?: string;
  CNPJ?: string;
  manager?: string;
  email?: string;
  phone?: string;
  socials?: WarehouseProps["socials"];
  address?: WarehouseProps["address"];
  coverage?: string[];
}

export class UpdateWarehouseUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private warehouseRepository: WarehouseRepository,
  ) {}

  async execute(user_id: string, data: UpdateWarehouseUseCaseRequest) {
    const user = await this.usersRepository.find("user", { id: user_id });

    if (!user) {
      throw new ResourceNotFoundError("Usuário", user_id);
    }

    if (!user.roles.includes("MANAGER")) {
      throw new UnauthorizedError();
    }

    const warehouse = await this.warehouseRepository.find();

    if (!warehouse) {
      throw new ResourceNotFoundError("Warehouse", "principal");
    }

    warehouse.name = data.name ?? warehouse.name;
    warehouse.CNPJ = data.CNPJ ?? warehouse.CNPJ;
    warehouse.manager = data.manager ?? warehouse.manager;
    warehouse.email = data.email ?? warehouse.email;
    warehouse.phone = data.phone ?? warehouse.phone;
    warehouse.socials = data.socials ?? warehouse.socials;
    warehouse.address = data.address ?? warehouse.address;
    warehouse.coverage = data.coverage ?? warehouse.coverage;

    await this.warehouseRepository.update(warehouse);

    return { warehouse };
  }
}
