const Problem = require("../models/problem.model.js");

const createProblem = async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: "Error creating problem" });
  }
};

const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select("title difficulty");
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problems" });
  }
};

const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problem" });
  }
};

module.exports = {
  getAllProblems,
  getProblemById,
  createProblem,
};