import Staff from "../models/Staff.js";

export const markAttendance = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { status } = req.body;

    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const today = new Date().toISOString().split("T")[0];

    const alreadyMarked = staff.attendance.find(
      (a) => a.date === today
    );

    if (alreadyMarked) {
      alreadyMarked.status = status;
    } else {
      staff.attendance.push({ date: today, status });
    }

    await staff.save(); // ✅ FIXED HERE

    res.json({ message: "Attendance updated", staff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
