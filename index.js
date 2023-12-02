const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const { initializeSocketIO } = require("./sockets/index");

dotenv.config();

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  }
});

// // This will make it global to access in routes
app.set("io", io);

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Backend is running!" });
});

app.use("/api/misc", require("./routes/misc_routes"));
app.use("/api/admin", require("./routes/admin_routes"));
app.use("/api/caretaker", require("./routes/caretaker_routes"));
app.use("/api/child", require("./routes/child_routes"));
app.use("/api/environment", require("./routes/environment_routes"));

initializeSocketIO(io);

server.listen(3000, () => console.log(`Server is running on PORT ${3000}`));
