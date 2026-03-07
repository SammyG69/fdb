const express = require("express");
const app = express();
app.get("/", (_, res) => res.json({ service: "meal_service" }));
app.listen(4002, () => console.log("meal_service on 4002"));