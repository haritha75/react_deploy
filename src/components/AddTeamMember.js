import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/AddTeamMember.css";

const AddTeamMember = () => {
  const { projectId } = useParams();
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/teams/project/${projectId}`
      )
      .then((response) => {
        const team = response.data;
        if (team) {
          setTeamName(team.teamName);
          setTeamId(team.teamId);
        } else {
          console.error("No team found for the provided project ID.");
          setTeamName("");
          setTeamId("");
        }
      })
      .catch((error) => {
        console.error("Error fetching team:", error);
        setTeamName("");
        setTeamId("");
      });

    axios
      .get(
        "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/admin/users"
      )
      .then((response) => {
        const filteredUsers = response.data.filter(
          (user) =>
            user.managerId === 0 &&
            user.userRole === "TEAM_MEMBER" &&
            user.status === "ACTIVE"
        );
        setUsers(filteredUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]);
      });
  }, [projectId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const params = new URLSearchParams({
      teamId: teamId,
      userId: userId,
    });

    axios
      .post(
        `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/teamMember?${params.toString()}`
      )
      .then((response) => {
        console.log("Team member added successfully:", response.data);
        setUserId("");
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error adding team member:",
          error.response ? error.response.data : error.message
        );
        setLoading(false);
      });
  };

  return (
    <div className="add-team-member-container">
      <form className="add-team-member-panel" onSubmit={handleSubmit}>
        <div className="add-team-member-header">Add Team Member</div>

        <div className="add-team-member-row">
          <div className="add-team-member-section">
            <label className="add-team-member-title" htmlFor="teamName">
              Team Name
            </label>
            <input
              className="add-team-member-content"
              id="teamName"
              type="text"
              value={teamName}
              disabled
            />
          </div>

          <div className="add-team-member-section">
            <label className="add-team-member-title" htmlFor="userId">
              User Name
            </label>
            <select
              className="add-team-member-content"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.userName} ({user.userId})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="add-team-member-alert"
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Team Member"}
        </button>
      </form>
    </div>
  );
};

export default AddTeamMember;
