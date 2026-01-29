import LeaveRequest from "../models/LeaveRequest.js";

// GET all leave requests
export const getLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest
      .find()
      .populate("staffId"); // must match schema field name

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE leave request
export const createLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.create(req.body);
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
