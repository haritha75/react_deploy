import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "./config/app";
import "../css/ViewTaskDetails.css";

const ViewTaskDetails = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [userName, setUserName] = useState("");
  const [timestamps, setTimestamps] = useState([]);
  const [project, setProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/projects/${projectId}`);
        setProject(response.data);
      } catch (err) {
        console.error("Project fetch error:", err);
        setError(err.message || "Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/tasks/project/${projectId}`);
        setTasks(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Tasks fetch error:", err);
        setError(err.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    fetchTasks();
  }, [projectId]);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (selectedTask) {
        setLoading(true);
        setError(null);
        try {
          const taskResponse = await api.get(`/tasks/${selectedTask}`);
          setTask(taskResponse.data);

          setUserName(taskResponse.data.user?.userName || "N/A");

          const timestampResponse = await api.get(
            `/tasks/${selectedTask}/timestamps`
          );
          setTimestamps(timestampResponse.data);
        } catch (err) {
          console.error("Task details fetch error:", err);
          setError(err.message || "Failed to fetch task details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTaskDetails();
  }, [selectedTask]);

  const handleTaskChange = (e) => {
    setSelectedTask(e.target.value);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="view-task-details-wrapper">
      <h2 className="task-details-title">
        {project && `Project: ${project.projectName}`}
      </h2>
      <div className="field-group">
        <label htmlFor="taskId" className="field-group-label">
          Task Name
        </label>
        <select
          id="taskId"
          name="taskId"
          value={selectedTask}
          onChange={handleTaskChange}
          className="field-group-select"
          required
        >
          <option value="">Select Task</option>
          {tasks.map((task) => (
            <option key={task.taskId} value={task.taskId}>
              {task.taskName}
            </option>
          ))}
        </select>
      </div>
      {task && (
        <div className="task-details">
          <p className="task-detail-item">
            <strong>Task Name:</strong> {task.taskName}
          </p>
          <p className="task-detail-item">
            <strong>Assigned User:</strong> {userName}
          </p>
          <p className="task-detail-item">
            <strong>End Date:</strong> {task.endDate}
          </p>
        </div>
      )}
      {timestamps.length > 0 && (
        <div className="timestamps">
          <h3 className="timestamps-title">Task Timestamps</h3>
          <ul className="timestamps-list">
            {timestamps.map((timestamp) => (
              <li key={timestamp.timeStampId} className="timestamp-item">
                <p className="timestamp-detail">
                  <strong>Timestamp:</strong>{" "}
                  {new Date(timestamp.timeStamp).toLocaleString()}
                </p>
                <p className="timestamp-detail">
                  <strong>Milestone:</strong>{" "}
                  {timestamp.milestone?.milestoneName || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewTaskDetails;
