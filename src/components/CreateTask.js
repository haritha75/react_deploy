import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/CreateTask.css";

const CreateTask = ({ onCreate }) => {
  const { projectId } = useParams();
  const [task, setTask] = useState({
    taskName: "",
    startDate: "",
    endDate: "",
    description: "",
    projectId: projectId || "",
    milestoneId: 0,
    userId: "",
  });
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/projects/${projectId}`
        );
        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/admin/users"
        );
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    const fetchMilestones = async () => {
      try {
        const response = await fetch(
          "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/milestones"
        );
        const data = await response.json();
        setMilestones(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch milestones:", err);
      }
    };

    fetchProject();
    fetchUsers();
    fetchMilestones();
  }, [projectId]);

  useEffect(() => {
    if (project && users.length > 0) {
      const filtered = users.filter((user) => {
        return (
          user.managerId === project.manager.userId &&
          user.userRole === "TEAM_MEMBER"
        );
      });
      setFilteredUsers(filtered);
    }
  }, [project, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: name === "milestoneId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const taskToCreate = {
        ...task,
        project: { projectId: task.projectId },
        user: { userId: task.userId },
      };

      if (task.milestoneId !== 0) {
        taskToCreate.milestone = { milestoneId: task.milestoneId };
      }

      const response = await fetch(
        "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskToCreate),
        }
      );

      if (!response.ok) throw new Error("Failed to create task");
      const createdTask = await response.json();
      onCreate(createdTask);

      setTask({
        taskName: "",
        startDate: "",
        endDate: "",
        description: "",
        projectId: projectId || "",
        milestoneId: 0,
        userId: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-wrapper">
      <h2 className="create-task-title">Create Task</h2>
      <form className="create-task-form" onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="taskName" className="field-group-label">
            Task Name
          </label>
          <input
            type="text"
            id="taskName"
            name="taskName"
            value={task.taskName}
            onChange={handleChange}
            className="field-group-input"
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="startDate" className="field-group-label">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={task.startDate}
            onChange={handleChange}
            className="field-group-input"
            required
          />
        </div>

        <div className="field-group">
          <label htmlFor="endDate" className="field-group-label">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={task.endDate}
            onChange={handleChange}
            className="field-group-input"
          />
        </div>

        <div className="field-group">
          <label htmlFor="description" className="field-group-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            className="field-group-textarea"
          />
        </div>

        <div className="field-group">
          <label htmlFor="projectId" className="field-group-label">
            Project
          </label>
          <input
            type="text"
            id="projectId"
            name="projectId"
            value={project?.projectName || ""}
            readOnly
            className="field-group-input"
          />
        </div>

        <div className="field-group">
          <label htmlFor="milestoneId" className="field-group-label">
            Milestone
          </label>
          <select
            id="milestoneId"
            name="milestoneId"
            value={task.milestoneId}
            onChange={handleChange}
            className="field-group-select"
          >
            <option value={0}>Select Milestone</option>
            {milestones.map((milestone) => (
              <option key={milestone.milestoneId} value={milestone.milestoneId}>
                {milestone.milestoneName}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label htmlFor="userId" className="field-group-label">
            Assigned User
          </label>
          <select
            id="userId"
            name="userId"
            value={task.userId}
            onChange={handleChange}
            className="field-group-select"
            required
          >
            <option value="">Select User</option>
            {filteredUsers.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.userName}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </button>
        {/* {error && <p className="error-message">{error}</p>} */}
      </form>
    </div>
  );
};

export default CreateTask;
