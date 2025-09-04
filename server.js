const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cors());

connectDB();

app.use("/tasks", taskRoutes);

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
