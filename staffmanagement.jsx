import React, { useState, useEffect } from "react";
import "./staffmanagement.css";

export default function Staffmanagement() {
  const [staff, setStaff] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [addingStaff, setAddingStaff] = useState(false);

  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    phone: "",
  });

  const [leaveForm, setLeaveForm] = useState({
    staffId: "",
    type: "",
    startDate: "",
    endDate: "",
  });

  /* ================= HELPERS ================= */

  const today = new Date().toISOString().split("T")[0];

  const hasMarkedToday = (attendance = []) => {
    return attendance.some((a) => a.date === today);
  };

  /* ================= FETCH STAFF ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/staff")
      .then((res) => res.json())
      .then((data) => setStaff(data))
      .catch((err) => console.error("Failed to fetch staff", err));
  }, []);

  /* ================= FETCH LEAVES ================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/leave")
      .then((res) => res.json())
      .then((data) => setLeaveRequests(data))
      .catch((err) => console.error("Failed to fetch leaves", err));
  }, []);

  /* ================= STAFF ================= */

  const startAddStaff = () => {
    setAddingStaff(true);
    setNewStaff({ name: "", role: "", phone: "" });
  };

  const saveNewStaff = async () => {
    if (!newStaff.name || !newStaff.role || !newStaff.phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });

      const savedStaff = await res.json();
      setStaff([...staff, savedStaff]);
      setAddingStaff(false);
      setNewStaff({ name: "", role: "", phone: "" });
    } catch (err) {
      alert("Error saving staff");
    }
  };

  const deleteStaff = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/staff/${id}`, {
        method: "DELETE",
      });
      setStaff(staff.filter((s) => s._id !== id));
    } catch (err) {
      alert("Failed to delete staff");
    }
  };

  const markAttendance = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/attendance/mark/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setStaff(staff.map((s) => (s._id === id ? data.staff : s)));
    } catch {
      alert("Error marking attendance");
    }
  };

  const updateStaffField = (id, field, value) => {
    setStaff(
      staff.map((s) => (s._id === id ? { ...s, [field]: value } : s))
    );
  };

  /* ================= LEAVE ================= */

  const handleLeaveChange = (e) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  };

  const submitLeaveRequest = async () => {
    if (
      !leaveForm.staffId ||
      !leaveForm.type ||
      !leaveForm.startDate ||
      !leaveForm.endDate
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await fetch("http://localhost:5000/api/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveForm),
      });

      const res = await fetch("http://localhost:5000/api/leave");
      const data = await res.json();
      setLeaveRequests(data);

      setLeaveForm({
        staffId: "",
        type: "",
        startDate: "",
        endDate: "",
      });
    } catch {
      alert("Error submitting leave");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="staff-container">
      <h2 className="staff-header">Staff Management & Attendance</h2>

      <button className="btn-add-staff" onClick={startAddStaff}>
        + Add Staff
      </button>

      <table className="staff-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Attendance</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {staff.map((person) => (
            <tr key={person._id}>
             <td>EMP{String(person.staffId).padStart(3, "0")}</td>

              <td>
                <input
                  value={person.name}
                  onChange={(e) =>
                    updateStaffField(person._id, "name", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  value={person.role}
                  onChange={(e) =>
                    updateStaffField(person._id, "role", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  value={person.phone}
                  onChange={(e) =>
                    updateStaffField(person._id, "phone", e.target.value)
                  }
                />
              </td>

              <td>
                {person.attendance?.length
                  ? `${person.attendance.at(-1).date} (${person.attendance.at(-1).status})`
                  : "Not marked"}
              </td>

              <td>
                <button
                  disabled={hasMarkedToday(person.attendance)}
                  onClick={() =>
                    markAttendance(person._id, "Present")
                  }
                >
                  Present
                </button>

                <button
                  disabled={hasMarkedToday(person.attendance)}
                  onClick={() =>
                    markAttendance(person._id, "Absent")
                  }
                >
                  Absent
                </button>

                <button onClick={() => deleteStaff(person._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {addingStaff && (
            <tr>
              <td>New</td>
              <td>
                <input
                  placeholder="Name"
                  value={newStaff.name}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, name: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  placeholder="Role"
                  value={newStaff.role}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, role: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  placeholder="Phone"
                  value={newStaff.phone}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, phone: e.target.value })
                  }
                />
              </td>
              <td></td>
              <td>
                <button onClick={saveNewStaff}>Save</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* LEAVE FORM */}
      <div className="leave-form">
        <h3>Request Leave</h3>

        <select
          name="staffId"
          value={leaveForm.staffId}
          onChange={handleLeaveChange}
        >
          <option value="">Select Staff</option>
          {staff.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          name="type"
          placeholder="Leave Type"
          value={leaveForm.type}
          onChange={handleLeaveChange}
        />

        <input
          type="date"
          name="startDate"
          value={leaveForm.startDate}
          onChange={handleLeaveChange}
        />
        <input
          type="date"
          name="endDate"
          value={leaveForm.endDate}
          onChange={handleLeaveChange}
        />

        <button onClick={submitLeaveRequest}>Submit Leave</button>
      </div>

      {/* LEAVE TABLE */}
      <h3>Leave Requests</h3>
      <table className="staff-table">
        <thead>
          <tr>
            <th>Staff</th>
            <th>Type</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((lr, idx) => (
            <tr key={idx}>
              <td>{lr.staffId?.name || "Unknown"}</td>
              <td>{lr.type}</td>
              <td>{lr.startDate}</td>
              <td>{lr.endDate}</td>
              <td>{lr.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
