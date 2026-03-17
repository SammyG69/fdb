import express from "express";
import { producer } from './src/kafka.js';
import router from "./metrics/index.js";

const app = express();
app.use(express.json());
app.use(router)
app.get("/", (req, res) => {
  res.json({ service: "user_service running" });
});

app.listen(4001, () => {
  console.log("User service running on port 4001");
});
