import "dotenv/config";
import express from "express";
import { randomUUID } from "crypto";

import { producer } from "./src/kafka.js";
import { mealLoggedEventSchema } from "../shared/schemas/mealLogged.schema.js";
import { mealUpdatedEventSchema } from "../shared/schemas/mealUpdated.schema.js";
import { mealDeletedEventSchema } from "../shared/schemas/mealDeleted.schema.js";

console.log("STARTED NEW VERSION: EVT_29_BUILD");
console.log("CWD:", process.cwd());

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ service: "meal_service" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "meal_service" });
});

/**
 * Helper to publish validated events
 */
async function publishEvent(topic, event) {
  await producer.send({
    topic,
    messages: [
      {
        key: event.payload.userId,
        value: JSON.stringify(event),
      },
    ],
  });
}

/**
 * POST /test-publish/logged
 * Publishes a MealLogged event
 */
app.post("/test-publish/logged", async (req, res) => {
  try {
    const now = new Date().toISOString();

    const rawEvent = {
      eventId: randomUUID(),
      eventType: "MealLogged",
      version: 1,
      occurredAt: now,
      source: "meal_service",
      payload: {
        mealLogId: randomUUID(),
        mealId: randomUUID(),
        userId: randomUUID(),
        name: "Chicken Rice Bowl",
        calories: 850,
        protein: 50,
        carbs: 55,
        fat: 20,
        loggedAt: now,
      },
    };

    const event = mealLoggedEventSchema.parse(rawEvent);

    console.log("ABOUT TO PUBLISH MealLogged EVENT:");
    console.log(event);

    await publishEvent("meal.events", event);

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("MealLogged publish failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "MealLogged publish failed",
    });
  }
});

/**
 * POST /test-publish/updated
 * Publishes a MealUpdated event
 */
app.post("/test-publish/updated", async (req, res) => {
  try {
    const now = new Date().toISOString();

    const rawEvent = {
      eventId: randomUUID(),
      eventType: "MealUpdated",
      version: 1,
      occurredAt: now,
      source: "meal_service",
      payload: {
        mealId: randomUUID(),
        userId: randomUUID(),
        name: "Updated Chicken Rice Bowl",
        calories: 900,
        protein: 55,
        carbs: 60,
        fat: 22,
        loggedAt: now,
      },
    };

    const event = mealUpdatedEventSchema.parse(rawEvent);

    console.log("ABOUT TO PUBLISH MealUpdated EVENT:");
    console.log(event);

    await publishEvent("meal.events", event);

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("MealUpdated publish failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "MealUpdated publish failed",
    });
  }
});

/**
 * POST /test-publish/deleted
 * Publishes a MealDeleted event
 */
app.post("/test-publish/deleted", async (req, res) => {
  try {
    const now = new Date().toISOString();

    const rawEvent = {
      eventId: randomUUID(),
      eventType: "MealDeleted",
      version: 1,
      occurredAt: now,
      source: "meal_service",
      payload: {
        mealId: randomUUID(),
        userId: randomUUID(),
        deletedAt: now,
      },
    };

    const event = mealDeletedEventSchema.parse(rawEvent);

    console.log("ABOUT TO PUBLISH MealDeleted EVENT:");
    console.log(event);

    await publishEvent("meal.events", event);

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("MealDeleted publish failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "MealDeleted publish failed",
    });
  }
});

async function start() {
  try {
    await producer.connect();
    console.log("Kafka Producer connected for meal_service");

    app.listen(4002, () => {
      console.log("meal_service on 4002");
    });
  } catch (error) {
    console.error("Failed to start meal_service:", error);
    process.exit(1);
  }
}

start();