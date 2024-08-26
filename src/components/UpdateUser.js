import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/UpdateUser.css";

const UpdateUser = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user_id: "",
    role: "",
    managerid: "",
    status: "",
    specialization: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/admin/users"
      )
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
        setError("There was an error fetching the users.");
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { user_id, role, managerid, status } = formData;

    if (!user_id || !role || !status) {
      alert("Please fill in all the required fields.");
      return;
    }

    axios
      .put(
        `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/admin/updateUser/${user_id}`,
        {
          ...formData,
          user_id: parseInt(user_id, 10),
          managerid: parseInt(managerid, 10),
        }
      )
      .then((response) => {
        console.log("User updated:", response.data);
        alert("User updated successfully!");
        setFormData({
          user_id: "",
          role: "",
          managerid: "",
          status: "",
          specialization: "",
        });
      })
      .catch((error) => {
        console.error("There was an error updating the user!", error);
        alert("There was an error updating the user!");
      });
  };

  return (
    <div id="updateUserForm" className="update-form-container">
      <h2 className="update-form-title">Update User</h2>
      {error && <p className="update-form-error">{error}</p>}
      <form id="userForm" className="update-form" onSubmit={handleSubmit}>
        <label htmlFor="user_id" className="update-form-label">
          Select User:
        </label>
        <select
          id="user_id"
          name="user_id"
          className="update-form-select"
          value={formData.user_id}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a User --</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.userName} (ID: {user.userId})
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="role" className="update-form-label">
          Current Role:
        </label>
        <select
          id="role"
          name="role"
          className="update-form-select"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="ADMIN">ADMIN</option>
          <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
          <option value="TEAM_MEMBER">TEAM_MEMBER</option>
        </select>
        <br />

        <label htmlFor="status" className="update-form-label">
          Status:
        </label>
        <select
          id="status"
          name="status"
          className="update-form-select"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="">Select Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
        <br />

        <label htmlFor="specialization" className="update-form-label">
          Specialization:
        </label>
        <input
          type="text"
          id="specialization"
          name="specialization"
          className="update-form-input"
          value={formData.specialization}
          onChange={handleChange}
        />
        <br />

        <button type="submit" className="update-form-button common">
          Update User
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
