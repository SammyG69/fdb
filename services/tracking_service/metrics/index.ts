import { NextApiRequest, NextApiResponse } from "next";
import { register, collectDefaultMetrics } from "prom-client";

// Register default metrics only once.
if (!globalThis.metricsRegistered) {
  const prefix = 'my_application_';
  collectDefaultMetrics({prefix });
  globalThis.metricsRegistered = true;
}

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
}