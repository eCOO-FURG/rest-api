// Libraries
import { Router } from "express";

// Middlewares
import { ensureRole } from "@/infra/http/middlewares/ensure-role";
import { processFiles } from "@/infra/http/middlewares/process-files";

// Controllers
import { listFarmsController } from "@/infra/http/controllers/list-farms";
import { fetchFarmController } from "@/infra/http/controllers/fetch-farm";
import { registerFarmController } from "@/infra/http/controllers/register-farm";
import { fetchUserFarmController } from "@/infra/http/controllers/fetch-user-farm";
import { handleFarmController } from "@/infra/http/controllers/handle-farm";
import { updateFarmController } from "@/infra/http/controllers/update-farm";
import { registerFarmImageController } from "@/infra/http/controllers/register-farm-image";
import { deleteFarmImageController } from "@/infra/http/controllers/delete-farm-image";

export const farms = Router();

farms.get("/", ensureRole(["BROKER", "MANAGER"]), listFarmsController);
farms.get("/own", ensureRole(["PRODUCER"]), fetchUserFarmController);
farms.get("/:farm_id", fetchFarmController);

farms.post("/", registerFarmController);
farms.post(
  "/own/images",
  ensureRole(["PRODUCER"]),
  processFiles([
    {
      name: "image",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
  ]),
  registerFarmImageController
);

farms.patch(
  "/own",
  ensureRole(["PRODUCER"]),
  processFiles([
    {
      name: "photo",
      options: { allowed: ["image/jpeg", "image/png"], size: 1 },
    },
    {
      name: "images",
      options: { allowed: ["image/jpeg", "image/png"], size: 1, max: 4 },
    },
  ]),
  updateFarmController
);
farms.patch("/:farm_id", ensureRole(["MANAGER"]), handleFarmController);

farms.delete(
  "/own/images/:image_url",
  ensureRole(["PRODUCER"]),
  deleteFarmImageController
);
