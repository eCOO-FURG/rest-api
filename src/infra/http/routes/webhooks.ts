// Libraries
import { Router } from "express";

// Webhooks
import { openPixWebhookListener } from "@/infra/http/webhooks/open-pix";

export const webhooks = Router();

webhooks.post("/openpix", openPixWebhookListener);
