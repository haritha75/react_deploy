import React, { useEffect, useState } from "react";
import api from "./config/app";
import "../css/Dashboard.css";
import { Pagination, Form, InputGroup } from "react-bootstrap";

const Dashboard = () => {
  const [data, setData] = useState({
    totalProjects: 0,
    totalTeam: 0,
    totalTasks: 0,
    totalUsers: 0,
    totalClients: 0,
  });
  const [detailedData, setDetailedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [projectsRes, usersRes, tasksRes, clientsRes, teamsRes] =
          await Promise.all([
            api.get("/projects"),
            api.get("/admin/users"),
            api.get("/tasks"),
            api.get("/clients"),
            api.get("/teams"),
          ]);

        setData({
          totalProjects: projectsRes.data.length,
          totalTeam: teamsRes.data.length,
          totalTasks: tasksRes.data.length,
          totalUsers: usersRes.data.length,
          totalClients: clientsRes.data.length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(detailedData);
    } else {
      setFilteredData(
        detailedData.filter((item) => {
          switch (activeCard) {
            case "projects":
              return item.projectName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            case "team":
              return item.teamName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            case "users":
              return item.userName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            case "clients":
              return item.clientName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            default:
              return false;
          }
        })
      );
    }
  }, [searchTerm, detailedData, activeCard]);

  const handleCardClick = async (type) => {
    setActiveCard(type);
    setCurrentPage(1);
    setSearchTerm("");
    try {
      let res;
      switch (type) {
        case "projects":
          res = await api.get("/projects");
          break;
        case "team":
          res = await api.get("/teams");
          break;
        case "users":
          res = await api.get("/admin/users");
          break;
        case "clients":
          res = await api.get("/clients");
          break;
        default:
          return;
      }
      const details = res.data;
      setDetailedData(details);
      setFilteredData(details); // Initialize filtered data with the full dataset
    } catch (error) {
      console.error("Error fetching detailed data:", error);
    }
  };

  const renderTableHeaders = () => {
    switch (activeCard) {
      case "projects":
        return (
          <>
            <th>Project Name</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Client Name</th>
            <th>Manager</th>
          </>
        );
      case "team":
        return (
          <>
            <th>Team Name</th>
            <th>Manager</th>
            <th>Project</th>
          </>
        );
      case "users":
        return (
          <>
            <th>User Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Specialization</th>
          </>
        );
      case "clients":
        return (
          <>
            <th>Client Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    switch (activeCard) {
      case "projects":
        return currentItems.map((project) => (
          <tr key={project.projectId}>
            <td>{project.projectName || "N/A"}</td>
            <td>{project.description || "N/A"}</td>
            <td>{project.startDate || "N/A"}</td>
            <td>{project.endDate || "N/A"}</td>
            <td>{project.client?.clientName || "N/A"}</td>
            <td>{project.manager?.userName || "N/A"}</td>
          </tr>
        ));
      case "team":
        return currentItems.map((team) => (
          <tr key={team.teamId}>
            <td>{team.teamName || "N/A"}</td>
            <td>{team.manager?.userName || "N/A"}</td>
            <td>{team.project?.projectName || "N/A"}</td>
          </tr>
        ));
      case "users":
        return currentItems.map((user) => (
          <tr key={user.userId}>
            <td>{user.userName || "N/A"}</td>
            <td>{user.userRole || "N/A"}</td>
            <td>{user.email || "N/A"}</td>
            <td>{user.phone || "N/A"}</td>
            <td>{user.status || "N/A"}</td>
            <td>{user.specialization || "N/A"}</td>
          </tr>
        ));
      case "clients":
        return currentItems.map((client) => (
          <tr key={client.clientId}>
            <td>{client.clientName || "N/A"}</td>
            <td>{client.clientCompanyName || "N/A"}</td>
            <td>{client.clientEmail || "N/A"}</td>
            <td>{client.clientPhone || "N/A"}</td>
          </tr>
        ));
      default:
        return null;
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="dashboard">
      {activeCard ? (
        <div className="details-table">
          <h3>
            Details for{" "}
            {activeCard.charAt(0).toUpperCase() + activeCard.slice(1)}
          </h3>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder={`Search ${activeCard}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
          </InputGroup>
          <table className="table table-striped">
            <thead>
              <tr>{renderTableHeaders()}</tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
          <Pagination>
            {Array.from(
              { length: Math.ceil(filteredData.length / itemsPerPage) },
              (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              )
            )}
          </Pagination>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => setActiveCard(null)}
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div className="card-container">
          <div className="card" onClick={() => handleCardClick("projects")}>
            <h3>Total Projects</h3>
            <p>{data.totalProjects}</p>
          </div>
          <div className="card" onClick={() => handleCardClick("team")}>
            <h3>Total Team</h3>
            <p>{data.totalTeam}</p>
          </div>
          <div className="card" onClick={() => handleCardClick("tasks")}>
            <h3>Total Tasks</h3>
            <p>{data.totalTasks}</p>
          </div>
          <div className="card" onClick={() => handleCardClick("users")}>
            <h3>Total Users</h3>
            <p>{data.totalUsers}</p>
          </div>
          <div className="card" onClick={() => handleCardClick("clients")}>
            <h3>Total Clients</h3>
            <p>{data.totalClients}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
