const express = require("express");
const sql = require("msnodesqlv8");
require("dotenv").config();
const connection = require("./config/db");

const app = express();
app.use(express.json());

app.use("/api/auth", require("./routes/auth_routes"));
app.use("/api/caretaker", require("./routes/caretaker_routes"));

app.get("/api", async (req, res) => {
  res.status(200).json({ message: "API is running!" });
});

/*
app.get("/", async (req, res) => {
  const query = "SELECT *  from admin";

  connection.request().query(query, (err, result) => {
    res.status(200).json({ result: result.recordset });
  });
});

app.post("/api/insert", async (req, res) => {
  const query =
    "INSERT INTO admin (first_name, last_name, email, password) VALUES ('John', 'Doe', 'john@a.com', '12345678')";
  connection.request().query(query, (err, result) => {
    console.dir(result);
  });
});
*/

app.listen(3000, () => console.log(`Server is running on PORT ${3000}`));
