const express = require("express");
const router = express.Router();
const {
  getAllProblems,
  getProblemById,
  createProblem,
} = require("../controllers/problem.controller.js");


router.get("/", getAllProblems);
router.get("/:id", getProblemById);
router.post("/", createProblem);

module.exports = router;