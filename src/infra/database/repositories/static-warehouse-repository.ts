// Entities
import { Warehouse } from "@/core/entities/warehouse";

// Repositories
import { WarehouseRepository } from "@/core/repositories/warehouse-repository";

// Libraries
import path from "path";
import * as fs from "fs";

// Errors
import { ResourceNotFoundError } from "@/core/errors/resource-not-found";

const WAREHOUSE_FOLDER = "warehouse";
const WAREHOUSE_FILE_NAME = "warehouse.json";

export class StaticWarehouseRepository implements WarehouseRepository {
  async find(): Promise<Warehouse> {
    const directory = this.useDirectory();
    const filePath = path.join(directory, WAREHOUSE_FILE_NAME);

    if (!fs.existsSync(filePath)) {
      throw new ResourceNotFoundError("Configuração", "do armazém");
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    return Warehouse.create(data);
  }

  async update(warehouse: Warehouse): Promise<void> {
    const directory = this.useDirectory();
    const url = path.join(directory, WAREHOUSE_FILE_NAME);

    const data = {
      id: warehouse.id.value,
      name: warehouse.name,
      CNPJ: warehouse.CNPJ,
      manager: warehouse.manager,
      email: warehouse.email,
      phone: warehouse.phone,
      socials: warehouse.socials,
      address: warehouse.address,
      coverage: warehouse.coverage,
      created_at: warehouse.created_at,
      updated_at: warehouse.updated_at,
    };

    fs.writeFileSync(url, JSON.stringify(data, null, 2));
  }

  async create(warehouse: Warehouse): Promise<void> {
    return this.update(warehouse);
  }

  private useDirectory(): string {
    const directory = path.join("/storage", WAREHOUSE_FOLDER);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    return directory;
  }
}
