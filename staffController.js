import Staff from "../models/Staff.js";
import Counter from "../models/Counter.js";

export const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ staffId: 1 });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, role, phone } = req.body;

    if (!name || !role || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const counter = await Counter.findOneAndUpdate(
      { name: "staffId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const staff = await Staff.create({
      staffId: counter.seq,
      name,
      role,
      phone,
      attendance: []
    });

    res.status(201).json(staff);
  } catch (err) {
    console.error("Create staff error:", err);
    res.status(500).json({ message: err.message });
  }
};
