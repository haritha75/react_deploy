import React from "react";
import TaskPieChart from "./TaskPieChart";
import "../css/TaskDetails.css";

const TaskDetails = () => {
  return (
    <div className="task-details-form-container">
      <h2>Tasks Status Overview</h2>
      <TaskPieChart />
    </div>
  );
};

export default TaskDetails;
