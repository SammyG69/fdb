require("dotenv").config();

const express = require("express");
const { producer } = require("./src/kafka");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({service: "meal-service"})
})

app.get("/health", (req, res)=> {
  res.json({ ok: true, service: "meal_service"});
})

app.post("/test-publish", async (req, res) => {
  try {
    const event = {
       eventId: "evt-1",
      mealId: "meal-123",
      userId: "user-123",
      calories: 650,
      protein: 40,
      carbs: 55,
      fat: 20,
      loggedAt: new Date().toISOString(),
    };

    await producer.send({
      topic: "meal.events",
      messages:[
        {
          key: event.userId,
          value: JSON.stringify(
            {
              eventType: "MealLogged",
              eventVersion: 1,
              ...event
            }
          ),
        }
      ],
    });

    res.json({ success: true, message: "Event published"});
  } catch(error)
  {
    console.error("Publish Failed: ", error);
    res.status(500).json({ success: false, error: "Publish failed"});
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
    console.error("Failed to start meal_service: ", error);
    process.exit(1);
  }
}

async function mealUpdated(meal_id, user_id, calories, protein, fat, fibre, carbs)
{
  try 
  {
    const event = {
      eventId: "event-2",
      mealId: meal_id,
      userId, user_id,
      calories: calories,
      

    }
  }
}

start();