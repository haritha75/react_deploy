import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/UserDetails.css";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

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

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
    setUser(null);
  };

  const fetchUserDetails = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedUserId) {
      setError("Please select a User.");
      return;
    }

    axios
      .get(
        `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/admin/users/${selectedUserId}`
      )
      .then((response) => {
        if (response.data) {
          setUser(response.data);
        } else {
          setError("User not found.");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the user details!", error);
        setError("There was an error fetching the user details.");
      });
  };

  return (
    <div className="user-details-container">
      <h2 className="user-details-title">Fetch User Details</h2>
      <form id="fetchForm" className="user-details-form">
        <label htmlFor="userId" className="user-details-label">
          Select User:
        </label>
        <select
          id="userId"
          name="userId"
          value={selectedUserId}
          onChange={handleUserChange}
          required
          className="user-details-info"
        >
          <option value="">-- Select a User --</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.userName} (ID: {user.userId})
            </option>
          ))}
        </select>
        <br />
        <button
          type="button"
          className="user-details-button common"
          onClick={fetchUserDetails}
        >
          Fetch User
        </button>
        {error && <p className="user-details-error">{error}</p>}
      </form>

      {user && (
        <div className="user-details-display">
          <h3 className="user-details-title">User Details:</h3>
          <p className="user-details-info">
            <strong>User ID:</strong> {user.userId}
          </p>
          <p className="user-details-info">
            <strong>User Name:</strong> {user.userName}
          </p>
          <p className="user-details-info">
            <strong>Role:</strong> {user.userRole}
          </p>
          <p className="user-details-info">
            <strong>Manager ID:</strong> {user.managerId}
          </p>
          <p className="user-details-info">
            <strong>Status:</strong> {user.status}
          </p>
          <p className="user-details-info">
            <strong>Specialization:</strong> {user.specialization}
          </p>
          <p className="user-details-info">
            <strong>Phone No:</strong> {user.phone}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
