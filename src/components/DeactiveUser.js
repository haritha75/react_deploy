import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/DeactiveUser.css";

const DeactivateUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/admin/users"
      )
      .then((response) => {
        const activeUsers = response.data.filter(
          (user) => user.status === "ACTIVE"
        );
        setUsers(activeUsers);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
        setError("There was an error fetching the users.");
      });
  }, []);

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUserId) {
      alert("Please select a User.");
      return;
    }

    axios
      .put(
        `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/admin/deactivateUser/${selectedUserId}`,
        { status: "INACTIVE" }
      )
      .then((response) => {
        alert("User deactivated successfully!");
        setSelectedUserId("");
        // Filter out the deactivated user from the list of active users
        setUsers(users.filter((user) => user.userId !== selectedUserId));
      })
      .catch((error) => {
        console.error("There was an error deactivating the user!", error);
        alert("There was an error deactivating the user!");
      });
  };

  return (
    <div id="deactivateUserForm" className="deactivate-form-container">
      <h2 className="deactivate-title">Deactivate User</h2>
      <form
        id="deactivateForm"
        className="deactivate-form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="userId" className="deactivate-label">
          Select User:
        </label>
        <select
          id="userId"
          name="userId"
          value={selectedUserId}
          onChange={handleUserChange}
          required
          className="deactivate-select"
        >
          <option value="">-- Select an Active User --</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.userName} (ID: {user.userId})
            </option>
          ))}
        </select>
        {error && <p className="deactivate-error">{error}</p>}
        <br />
        <button type="submit" className="deactivate-button common">
          Deactivate
        </button>
      </form>
    </div>
  );
};

export default DeactivateUser;
