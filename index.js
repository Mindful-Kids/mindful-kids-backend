const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const { initializeSocketIO } = require("./sockets/index");
const multer = require("./middlewares/multer");
const cloudinary = require("./config/cloudinary_client");

dotenv.config();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send("🚀 API is running!");
});

app.post("/upload-image", multer.single("image"), async (req, res) => {
  const { caption } = req.body;
  console.log(caption);
  if (!req.file)
    return res.status(422).json({ message: "Required fields are not filled." });

  const upload = await cloudinary.v2.uploader
    .upload(req.file.path, {
      public_id: Date.now().toString(),
      folder: process.env.CLOUDINARY_FOLDER_NAME,
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Error occurred while uploading image." });
    });

  if (!upload) {
    return res
      .status(500)
      .json({ message: "Error occurred while uploading image." });
  }

  return res.status(200).json({ url: upload.secure_url });
});

app.use("/api/misc", require("./routes/misc_routes"));
app.use("/api/admin", require("./routes/admin_routes"));
app.use("/api/caretaker", require("./routes/caretaker_routes"));
app.use("/api/environment", require("./routes/environment_routes"));
app.use("/api/reports", require("./routes/reports_routes"));

initializeSocketIO(io);

server.listen(3000, () => console.log(`Server is running on PORT ${3000}`));
