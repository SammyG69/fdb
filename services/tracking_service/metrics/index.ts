import { Router } from "express";
import { register, collectDefaultMetrics } from "prom-client";

const router = Router();

let metricsInitialized = false;

if (!metricsInitialized) {
  collectDefaultMetrics({ prefix: "tracking_service_" });
  metricsInitialized = true;
}

router.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default router;