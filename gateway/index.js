const express = require("express");
const app = express();
app.get("/", (_, res) => res.json({ service: "gateway" }));
app.listen(3000, () => console.log("gateway on 3000"));