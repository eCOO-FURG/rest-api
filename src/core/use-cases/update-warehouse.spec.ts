// Use-cases
import { UpdateWarehouseUseCase } from "@/core/use-cases/update-warehouse";

// Repositories
import { InMemoryWarehouseRepository } from "@/test/repositories/in-memory-warehouse-repository";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users-repository";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";
import { UnauthorizedError } from "@/core/errors/unauthorized";

// Entities & Factories
import { WarehouseAddress } from "@/core/entities/warehouse";
import { makeUser } from "@/test/factories/make-user";

let repositories: {
  warehouse: InMemoryWarehouseRepository;
  users: InMemoryUsersRepository;
};

let sut: UpdateWarehouseUseCase;

describe("Update warehouse", () => {
  beforeEach(() => {
    repositories = {
      warehouse: new InMemoryWarehouseRepository(),
      users: new InMemoryUsersRepository(),
    };

    sut = new UpdateWarehouseUseCase(repositories.users, repositories.warehouse);
  });

  it("should be able to update only one warehouse field", async () => {
    const manager = makeUser({
      roles: ["MANAGER"],
    });
    await repositories.users.create(manager);

    await sut.execute({
      user_id: manager.id.value,
      name: "New Warehouse Name",
    });

    const warehouse = await repositories.warehouse.find();
    expect(warehouse.name).toEqual("New Warehouse Name");
  });

  it("should be able to update multiple warehouse fields", async () => {
    const manager = makeUser({
      roles: ["MANAGER"],
    });
    await repositories.users.create(manager);

    await sut.execute({
      user_id: manager.id.value,
      name: "New Warehouse Name",
      CNPJ: "12.345.678/0001-90",
      manager: "New Manager",
    });

    const warehouse = await repositories.warehouse.find();
    expect(warehouse.name).toEqual("New Warehouse Name");
    expect(warehouse.CNPJ).toEqual("12.345.678/0001-90");
    expect(warehouse.manager).toEqual("New Manager");
  });

  it("should be able to update warehouse address", async () => {
    const manager = makeUser({
      roles: ["MANAGER"],
    });
    await repositories.users.create(manager);

    const newAddress: WarehouseAddress = {
      street: "New Street",
      number: "123",
      complement: "Apt 456",
      neighborhood: "Downtown",
      city: "New City",
      state: "NS",
      CEP: "12345-678",
      link: "https://maps.example.com/new-location",
    };

    await sut.execute({
      user_id: manager.id.value,
      address: newAddress,
    });

    const warehouse = await repositories.warehouse.find();
    expect(warehouse.address).toEqual(newAddress);
  });

  it("should be able to update warehouse coverage", async () => {
    const manager = makeUser({
      roles: ["MANAGER"],
    });
    await repositories.users.create(manager);

    const newCoverage = ["Area1", "Area2", "Area3"];

    await sut.execute({
      user_id: manager.id.value,
      coverage: newCoverage,
    });

    const warehouse = await repositories.warehouse.find();
    expect(warehouse.coverage).toEqual(newCoverage);
  });

  it("should not be able to update if user doesn't exist", async () => {
    await expect(() =>
      sut.execute({
        user_id: "non-existing-user-id",
        name: "New Name",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update if user is not a manager", async () => {
    const regularUser = makeUser({
      roles: ["USER"],
    });
    await repositories.users.create(regularUser);

    await expect(() =>
      sut.execute({
        user_id: regularUser.id.value,
        name: "New Name",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
