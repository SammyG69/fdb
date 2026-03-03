const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ service: "user_service running" });
});

app.listen(4001, () => {
  console.log("User service running on port 4001");
});