const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({ message: "API is running!" });
});

app.use("/api/admin", require("./routes/admin_routes"));
app.use("/api/caretaker", require("./routes/caretaker_routes"));
app.use("/api/environment", require("./routes/environment_routes"));

app.listen(3000, () => console.log(`Server is running on PORT ${3000}`));
