import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Accordion,
  Button,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import "../css/TeamMemberPage.css";

const TeamMemberPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState({});
  const [client, setClient] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDetails = async () => {
      try {
        const tasksResponse = await fetch(
          `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/user/${user.userId}`
        );
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setTasks(tasksData);

          if (tasksData.length > 0) {
            const projectResponse = await fetch(
              `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/projects/${tasksData[0].project.projectId}`
            );
            if (projectResponse.ok) {
              const projectData = await projectResponse.json();
              setProject(projectData);

              const clientResponse = await fetch(
                `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/clients/${projectData.client.clientId}`
              );
              if (clientResponse.ok) {
                const clientData = await clientResponse.json();
                setClient(clientData);
              } else {
                setError("Failed to fetch client data");
              }
            } else {
              setError("Failed to fetch project data");
            }
          }
        } else {
          setError("Failed to fetch tasks");
        }
      } catch (error) {
        setError("An error occurred while fetching details: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [user, navigate]);

  const handleUpdateStatusClick = () => {
    navigate(`/team-member/update-task-status`, { state: { user } });
  };

  const handleLogoutClick = () => {
    navigate("/login");
  };

  if (!user) return null;

  return (
    <Container className="tm-login">
      <Row className="mb-5">
        <Col className="welcome">
          <h1>Welcome, {user.userName}!</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="danger"
            onClick={handleLogoutClick}
            id="logout-button-team"
          >
            Logout
          </Button>
        </Col>
      </Row>

      <Row className="mb-4 tasks-detail">
        <Col id="your-tasks">
          <h2 id="head">Your Tasks:</h2>
        </Col>
        <Col>
          {loading ? (
            <Spinner animation="border" />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Accordion>
              {tasks.map((task) => (
                <Accordion.Item eventKey={task.taskId} key={task.taskId}>
                  <Accordion.Header>{task.taskName}</Accordion.Header>
                  <Accordion.Body>
                    <p>Description: {task.description}</p>
                    <p>Status: {task.milestone?.milestoneName || "N/A"}</p>
                    <p>Start Date: {task.startDate}</p>
                    <p>Due Date: {task.endDate}</p>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
        </Col>
      </Row>
      <Row className="mt-4 d-flex justify-content-center">
        <Col md={5} sm={12}>
          <Card className="project-card">
            <Card.Body>
              <Card.Title>Project Details</Card.Title>
              <Card.Text>
                Project Name: {project.projectName || "N/A"}
                <br />
                Description: {project.description || "N/A"}
                <br />
                Start Date: {project.startDate || "N/A"}
                <br />
                Due Date: {project.endDate || "N/A"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12}>
          <Card className="client-card">
            <Card.Body>
              <Card.Title>Client Details</Card.Title>
              <Card.Text>
                Client Name: {client.clientName || "N/A"}
                <br />
                Company Name: {client.clientCompanyName || "N/A"}
                <br />
                Contact: {client.clientEmail || "N/A"}
                <br />
                Phone: {client.clientPhone || "N/A"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} sm={12} className="update-button-col">
          <Button
            variant="primary"
            onClick={handleUpdateStatusClick}
            id="update-milestone-button"
          >
            Update Task Milestone
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default TeamMemberPage;
