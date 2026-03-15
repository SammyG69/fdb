import { Router } from "express";
import { register, collectDefaultMetrics } from "prom-client";

const router = Router();

collectDefaultMetrics({ prefix: "meal_service_" });

router.get("/metrics", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default router;