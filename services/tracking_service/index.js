const express = require("express");
const app = express();
app.get("/", (_, res) => res.json({ service: "tracking_service" }));
app.listen(4003, () => console.log("tracking_service on 4003"));