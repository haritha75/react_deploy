import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";
import "../css/RemoveTeamMember.css";

const RemoveTeamMember = () => {
  const { projectId } = useParams();
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [userId, setUserId] = useState("");
  const [usersInTeam, setUsersInTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (projectId) {
      axios
        .get(
          `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/teams/project/${projectId}`
        )
        .then((response) => {
          const team = response.data;
          if (team) {
            setTeamName(team.teamName);
            setTeamId(team.teamId);
            axios
              .get(
                `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/teamMember?teamId=${team.teamId}`
              )
              .then((response) => {
                const users = response.data.map((member) => ({
                  userId: member.user.userId,
                  userName: member.user.userName,
                }));
                setUsersInTeam(users);
              })
              .catch((error) => {
                console.error("Error fetching team members:", error);
                setUsersInTeam([]);
              });
          } else {
            console.error("No team found for the provided project ID.");
            setTeamName("");
            setTeamId("");
            setUsersInTeam([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching team:", error);
          setTeamName("");
          setTeamId("");
          setUsersInTeam([]);
        });
    }
  }, [projectId]);

  const handleRemove = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    setLoading(true);

    if (teamId && userId) {
      axios
        .delete(
          `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/teamMember?userId=${userId}&teamId=${teamId}`
        )
        .then((response) => {
          console.log("Team member removed successfully:", response.data);

          setUsersInTeam((prevUsers) =>
            prevUsers.filter((user) => user.userId !== userId)
          );

          return axios.patch(
            `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/users/${userId}`,
            {
              managerId: 0,
            }
          );
        })
        .then((response) => {
          console.log("User manager_id updated successfully:", response.data);

          // Clear local states
          setTeamName("");
          setUserId("");
          setLoading(false);
          setShowModal(false);
        })
        .catch((error) => {
          console.error(
            "Error removing team member or updating manager_id:",
            error.response ? error.response.data : error.message
          );
          setLoading(false);
          setShowModal(false);
        });
    } else {
      console.error("Team ID or User ID is missing.");
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="remove-team-member-container">
      <form
        className="remove-team-member-panel"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="remove-team-member-header">Remove Team Member</div>

        <div className="remove-team-member-row">
          <div className="remove-team-member-section">
            <label className="remove-team-member-title" htmlFor="teamName">
              Team Name
            </label>
            <input
              className="remove-team-member-content"
              id="teamName"
              type="text"
              value={teamName}
              disabled
            />
          </div>

          <div className="remove-team-member-section">
            <label className="remove-team-member-title" htmlFor="userId">
              User Name
            </label>
            <select
              className="remove-team-member-content"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            >
              <option value="">Select a user</option>
              {usersInTeam.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.userName} ({user.userId})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="remove-team-member-alert"
          type="button"
          onClick={handleRemove}
          disabled={loading}
        >
          {loading ? "Removing..." : "Remove Team Member"}
        </button>
      </form>

      <Modal show={showModal} onClose={handleClose} onConfirm={handleConfirm} />
    </div>
  );
};

export default RemoveTeamMember;
