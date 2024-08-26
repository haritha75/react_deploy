import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CreateProject.css";

const CreateProject = () => {
  const initialFormData = {
    projectName: "",
    projectDescription: "",
    startDate: "",
    endDate: "",
    clientId: null,
    managerId: null,
    teamName: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [projectCount, setProjectCount] = useState(0);
  const [clients, setClients] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    // Fetch projects to determine the next project ID
    // axios
    //   .get("https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/projects")
    //   .then((response) => {
    //     // const nextProjectId = response.data.length + 1;
    //     setFormData((prevData) => ({
    //       ...prevData,
    //       projectId: nextProjectId,
    //     }));
    //     setProjectCount(response.data.length);
    //   })
    //   .catch((error) => {
    //     console.error(
    //       "There was an error fetching the list of projects!",
    //       error
    //     );
    //   });

    // Fetch clients
    axios
      .get(
        "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/clients"
      )
      .then((response) => {
        console.log("Clients data:", response.data);
        setClients(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the list of clients!",
          error
        );
      });

    // Fetch managers
    axios
      .get(
        "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/admin/users"
      )
      .then((response) => {
        const filteredManagers = response.data.filter(
          (user) =>
            user.userRole === "PROJECT_MANAGER" && user.status === "ACTIVE"
        );
        setManagers(filteredManagers);
      })
      .catch((error) => {
        console.error("There was an error fetching the list of users!", error);
      });
  }, [projectCount]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedValue =
      name === "clientId" || name === "managerId"
        ? value === ""
          ? ""
          : Number(value)
        : value;

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleProject = (e) => {
    e.preventDefault();

    const {
      projectId,
      projectName,
      projectDescription,
      startDate,
      endDate,
      clientId,
      managerId,
      teamName,
    } = formData;

    console.log("Form data before validation:", formData);
    if (
      projectId === null ||
      !projectName ||
      !projectDescription ||
      !startDate ||
      !endDate ||
      clientId === "" ||
      managerId === "" ||
      !teamName
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    const projectData = {
      projectName,
      description: projectDescription,
      startDate,
      endDate,
      client: { clientId: Number(clientId) },
      manager: { userId: Number(managerId) },
      percentageLeft: 0.0,
    };

    axios
      .post(
        `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/projects?teamName=${encodeURIComponent(
          teamName
        )}`,
        projectData
      )
      .then((response) => {
        console.log("Form data submitted:", response.data);
        alert("Project created successfully!");
        setProjectCount(projectCount + 1);
        setFormData(initialFormData);
      })
      .catch((error) => {
        console.error("Error details:", error.response.data);
        alert("There was an error creating the project!");
      });
  };

  return (
    <div className="create-project-form-container">
      <h2 className="create-project-title">Create Project</h2>
      <form id="projectForm" className="create-project-form">
        <label htmlFor="projectName" className="create-project-label">
          Project Name:
        </label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          className="create-project-input"
          value={formData.projectName}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="clientId" className="create-project-label">
          Client ID:
        </label>
        <select
          id="clientId"
          name="clientId"
          className="create-project-input"
          value={formData.clientId || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.clientId} value={client.clientId}>
              {client.clientId} - {client.clientName}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="managerId" className="create-project-label">
          Manager ID:
        </label>
        <select
          id="managerId"
          name="managerId"
          className="create-project-input"
          value={formData.managerId}
          onChange={handleChange}
          required
        >
          <option value="">Select Manager</option>
          {managers.map((manager) => (
            <option key={manager.userId} value={manager.userId}>
              {manager.userId} - {manager.userName}
            </option>
          ))}
        </select>
        <br />

        <label htmlFor="teamName" className="create-project-label">
          Team Name:
        </label>
        <input
          type="text"
          id="teamName"
          name="teamName"
          className="create-project-input"
          value={formData.teamName}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="projectDescription" className="create-project-label">
          Project Description:
        </label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          className="create-project-input"
          value={formData.projectDescription}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="startDate" className="create-project-label">
          Start Date:
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          className="create-project-input"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        <br />

        <label htmlFor="endDate" className="create-project-label">
          End Date:
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          className="create-project-input"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
        <br />

        <button
          type="button"
          className="create-project-button common"
          onClick={handleProject}
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
