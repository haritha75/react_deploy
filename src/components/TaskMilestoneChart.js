import React, { useEffect, useState } from "react";
import api from "./config/app";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useParams } from "react-router-dom";
import "../css/TaskMilestoneChart.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  ChartDataLabels
);

const TaskMilestoneChart = () => {
  const { projectId } = useParams();
  const [taskData, setTaskData] = useState([]);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await api.get(`/projects/${projectId}`);
        setProjectName(projectResponse.data.projectName);
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const tasksResponse = await api.get(`/tasks/project/${projectId}`);
        setTaskData(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchProjectDetails();
    fetchTasks();
  }, [projectId]);

  const stageToHeightMap = {
    1: 20,
    2: 40,
    3: 60,
    4: 80,
    5: 100,
  };

  const chartData = {
    labels: taskData.map((task) => task.taskName),
    datasets: [
      {
        label: "Milestone Progress",
        data: taskData.map(
          (task) => stageToHeightMap[task.milestone.milestoneId] || 0
        ),
        backgroundColor: taskData.map((_, index) => {
          const colors = [
            "rgba(75, 192, 192, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 59, 224, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 189, 64, 0.6)",
            "rgba(255, 25, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ];
          return colors[index % colors.length];
        }),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const task = taskData[context.dataIndex];
            return `${task.milestone.milestoneName} - Progress: ${
              stageToHeightMap[task.milestone.milestoneId] || 20
            }%`;
          },
        },
      },
      datalabels: {
        anchor: "end",
        align: "end",
        color: "#333",
        font: {
          size: 14,
          weight: "bold",
        },
        formatter: (value) => `${value}%`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: "#333",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: true,
        },
      },
      x: {
        ticks: {
          color: "#333",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          display: true,
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <h2>{projectName}</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default TaskMilestoneChart;
