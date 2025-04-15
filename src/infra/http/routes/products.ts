// Libraries
import { Router } from "express";

// Middlewares
import { ensureRole } from "@/infra/http/middlewares/ensure-role";
import { processFiles } from "@/infra/http/middlewares/process-files";

// Controllers
import { listProductsController } from "@/infra/http/controllers/list-products";
import { registerProductController } from "@/infra/http/controllers/register-product";
import { updateProductController } from "@/infra/http/controllers/update-product";

export const products = Router();

products.get("/", listProductsController);

products.post(
  "/",
  ensureRole(["MANAGER"]),
  processFiles([
    {
      name: "image",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
  ]),
  registerProductController,
);

products.patch(
  "/:product_id",
  ensureRole(["MANAGER"]),
  processFiles([
    {
      name: "image",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
  ]),
  updateProductController,
);
