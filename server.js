const express = require("express");
const path = require("path");
const socket = require("socket.io");

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on Port: 8000");
});
const io = socket(server);

let tasks = [];

io.on("connection", (socket) => {
  socket.emit("updateData", tasks);

  socket.on("addTask", (task) => {
    tasks.push(task);
    socket.broadcast.emit("addTask", task);
  });

  socket.on("removeTask", (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    socket.broadcast.emit("removeTask", taskId);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: "Not found..." });
});
