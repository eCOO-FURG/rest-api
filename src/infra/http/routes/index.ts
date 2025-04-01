// Libraries
import { Router } from "express";

// Middlewares
import { logging } from "@/infra/http/middlewares/logging";

// Middlewares
import { ensureAuthenticated } from "@/infra/http/middlewares/ensure-authenticated";
import { ensureIntegration } from "@/infra/http/middlewares/ensure-integration";
import { ensureRole } from "@/infra/http/middlewares/ensure-role";

// Routes
import { auth } from "@/infra/http/routes/auth";
import { users } from "@/infra/http/routes/users";
import { me } from "@/infra/http/routes/me";
import { help } from "@/infra/http/routes/help";
import { farms } from "@/infra/http/routes/farms";
import { orders } from "@/infra/http/routes/orders";
import { boxes } from "@/infra/http/routes/boxes";
import { offers } from "@/infra/http/routes/offers";
import { catalogs } from "@/infra/http/routes/catalogs";
import { bags } from "@/infra/http/routes/bags";
import { payments } from "@/infra/http/routes/payments";
import { cycles } from "@/infra/http/routes/cycles";
import { products } from "@/infra/http/routes/products";
import { categories } from "@/infra/http/routes/categories";
import { pendings } from "@/infra/http/routes/pendings";
import { stats } from "@/infra/http/routes/stats";
import { reports } from "@/infra/http/routes/reports";
import { notifications } from "@/infra/http/routes/notifications";
import { webhooks } from "@/infra/http/routes/webhooks";

export const router = Router();

router.use(logging());

router.use("/auth", auth);
router.use("/users", users);
router.use("/me", ensureAuthenticated, me);
router.use("/help", ensureAuthenticated, help);
router.use("/farms", ensureAuthenticated, farms);
router.use("/orders", ensureAuthenticated, orders);
router.use("/boxes", ensureAuthenticated, boxes);
router.use("/offers", ensureAuthenticated, offers);
router.use("/catalogs", catalogs);
router.use("/bags", ensureAuthenticated, bags);
router.use("/payments", ensureAuthenticated, payments);
router.use("/cycles", cycles);
router.use("/products", ensureAuthenticated, products);
router.use("/categories", categories);
router.use("/pendings", ensureAuthenticated, ensureRole(["BROKER"]), pendings);
router.use("/stats", ensureAuthenticated, ensureRole(["MANAGER"]), stats);
router.use(
  "/reports",
  ensureAuthenticated,
  ensureRole(["BROKER", "MANAGER"]),
  reports
);
router.use(
  "/notifications",
  ensureAuthenticated,
  ensureRole(["MANAGER"]),
  notifications
);
router.use("/webhooks", ensureIntegration, webhooks);
