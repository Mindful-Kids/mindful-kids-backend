const express = require("express");
require("dotenv").config();
require("./config/db");

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({ message: "API is working" });
});

app.listen(3000, () => console.log(`Server is running on PORT ${3000}`));
