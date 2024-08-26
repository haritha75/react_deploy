import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "./config/app";
import "../css/TasksPageForManager.css";

const TasksPageForManager = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(10);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const projectsResponse = await api.get(
          `/projects/by-manager/${user.userId}`
        );
        const projects = projectsResponse.data;

        const projectIds = projects.map((project) => project.projectId);

        const tasksPromises = projectIds.map((projectId) =>
          api.get(`/tasks/project/${projectId}`).then((res) => res.data)
        );

        const tasksArray = await Promise.all(tasksPromises);
        const allTasks = tasksArray.flat();

        setTasks(allTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [user.userId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setTasksPerPage(5);
      } else {
        setTasksPerPage(10);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(tasks.length / tasksPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="tasks-page-container">
      <br />
      {tasks.length > 0 ? (
        <>
          <div className="tasks-page-table">
            <div className="tasks-page-header">
              <div className="tasks-page-header-item">Task Name</div>
              <div className="tasks-page-header-item">Created Date</div>
              <div className="tasks-page-header-item">Project Name</div>
              <div className="tasks-page-header-item">User</div>
            </div>
            <div className="tasks-page-body">
              {currentTasks.map((task) => (
                <div key={task.taskId} className="tasks-page-row">
                  <div className="tasks-page-item">{task.taskName}</div>
                  <div className="tasks-page-item">{task.createdAt}</div>
                  <div className="tasks-page-item">
                    {task.project.projectName}
                  </div>
                  <div className="tasks-page-item">
                    {task.user ? task.user.userName : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pagination">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={currentPage === number ? "active" : ""}
              >
                {number}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="tasks-page-empty-message">
          No tasks found for your projects.
        </p>
      )}
    </div>
  );
};

export default TasksPageForManager;
