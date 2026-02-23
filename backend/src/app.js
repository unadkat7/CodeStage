const express = require("express");
const cors = require("cors");
const problemRoutes = require("./routes/problem.routes.js");
const submissionRoutes = require("./routes/submission.routes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

module.exports = app;