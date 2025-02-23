const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const tempRoute = require("./routes/tempRoute");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
// const io = new Server(server);

// const dbURI = "mongodb://localhost:27017/mongodb_container";
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log("Error connecting to MongoDB:", err));

// io.on("connection", (socket) => {
//   console.log(`User connected: ${socket.id}`);

//   socket.on("message", (msg) => {
//     io.emit("message", msg);
//   });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "it's home page" }));
app.get("/checking", (req, res) => res.json({ message: "qweqweqwewqeqweqw" }));
app.use("/api", tempRoute);

server.listen(3333, () => console.log(`Server running on port 3333`));
