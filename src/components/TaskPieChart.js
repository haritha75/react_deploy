import React, { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import "../css/AdminTaskPieChart.css";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const TaskPieChart = () => {
  const chartRef = useRef(null);
  const [milestoneCounts, setMilestoneCounts] = useState({});
  const [milestoneNames, setMilestoneNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/milestones"
      )
      .then((response) => {
        const milestones = response.data;
        const milestoneNames = {};

        milestones.forEach((milestone) => {
          milestoneNames[milestone.milestoneId] = milestone.milestoneName;
        });

        setMilestoneNames(milestoneNames);

        return axios.get(
          "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/tasks"
        );
      })
      .then((response) => {
        const tasks = response.data;
        const milestoneCounts = {};

        tasks.forEach((task) => {
          const milestoneId = task.milestone.milestoneId;
          if (!milestoneCounts[milestoneId]) {
            milestoneCounts[milestoneId] = 0;
          }
          milestoneCounts[milestoneId]++;
        });

        setMilestoneCounts(milestoneCounts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const allMilestoneIds = Object.keys(milestoneNames);
  const milestoneData = allMilestoneIds.map((id) => ({
    id,
    count: milestoneCounts[id] || 0,
  }));

  const data = {
    labels: milestoneData.map((item) => milestoneNames[item.id]),
    datasets: [
      {
        data: milestoneData.map((item) => item.count),
        backgroundColor: [
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#FF6384",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(2) + "%";
          return percentage;
        },
        color: "#fff",
        font: {
          weight: "bold",
        },
      },
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  return (
    <div className="admin-task-pie-chart-wrapper">
      <div className="admin-task-pie-chart-container">
        <Pie data={data} options={options} ref={chartRef} />
      </div>
    </div>
  );
};

export default TaskPieChart;
