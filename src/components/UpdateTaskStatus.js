import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../css/UpdateTaskStatus.css";

const ItemTypes = {
  TASK: "task",
};

const Task = ({ task, index, moveTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { index, task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="task-items-status"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {task.taskName}
    </div>
  );
};

const Column = ({ column, tasks, moveTask, openEditModal }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => moveTask(item.task, column),
  });

  return (
    <div ref={drop} className="status-column custom-col">
      <div className="milestone-header">
        <h2 className="statushead">{column.milestoneName}</h2>
      </div>
      <div className="task-lists-status">
        {tasks.map((task, index) => (
          <Task
            key={task.taskId}
            task={task}
            index={index}
            moveTask={moveTask}
          />
        ))}
        <div className="button-wrapper-status">
          <Button
            variant="primary"
            className="edit-btn"
            onClick={() => openEditModal(column)}
          >
            🖋
          </Button>
        </div>
      </div>
    </div>
  );
};

const UpdateTaskStatus = () => {
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("");
  const [editMilestone, setEditMilestone] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchTasksAndMilestones = async () => {
      try {
        const [tasksResponse, milestonesResponse] = await Promise.all([
          fetch(
            `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/user/${user.userId}`
          ),
          fetch(
            `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/milestones`
          ),
        ]);

        if (tasksResponse.ok && milestonesResponse.ok) {
          const [tasksData, milestonesData] = await Promise.all([
            tasksResponse.json(),
            milestonesResponse.json(),
          ]);
          setTasks(tasksData);
          setMilestones(milestonesData);
        } else {
          setError("Failed to fetch tasks or milestones");
        }
      } catch (error) {
        setError("An error occurred while fetching data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksAndMilestones();
  }, [user, navigate]);

  const moveTask = async (task, newMilestone) => {
    const updatedTasks = tasks.map((t) =>
      t.taskId === task.taskId ? { ...t, milestone: newMilestone } : t
    );
    setTasks(updatedTasks);

    try {
      await fetch(
        `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/${task.taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ milestoneId: newMilestone.milestoneId }),
        }
      );
    } catch (error) {
      setError(
        "An error occurred while updating task milestone: " + error.message
      );
    }
  };

  const handleCreateMilestone = async () => {
    try {
      const response = await fetch(
        `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/milestones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            milestoneName: newMilestoneName,
            milestoneDescription: newMilestoneDescription,
          }),
        }
      );

      if (response.ok) {
        const newMilestone = await response.json();
        setMilestones([...milestones, newMilestone]);
        setShowModal(false);
        setNewMilestoneName("");
        setNewMilestoneDescription("");
      } else {
        setError("Failed to create milestone");
      }
    } catch (error) {
      setError("An error occurred while creating milestone: " + error.message);
    }
  };

  const updateMilestoneName = async (milestoneId, newName, newDescription) => {
    try {
      const response = await fetch(
        `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/milestones/${milestoneId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            milestoneName: newName,
            milestoneDescription: newDescription,
          }),
        }
      );

      if (response.ok) {
        const updatedMilestone = await response.json();
        setMilestones((prevMilestones) =>
          prevMilestones.map((milestone) =>
            milestone.milestoneId === milestoneId
              ? {
                  ...milestone,
                  milestoneName: updatedMilestone.milestoneName,
                  milestoneDescription: updatedMilestone.milestoneDescription,
                }
              : milestone
          )
        );
      } else {
        setError("Failed to update milestone name");
      }
    } catch (error) {
      setError(
        "An error occurred while updating milestone name: " + error.message
      );
    }
  };

  const openEditModal = (milestone) => {
    setEditMilestone(milestone);
    setNewMilestoneName(milestone.milestoneName);
    setNewMilestoneDescription(milestone.milestoneDescription);
    setShowModal(true);
  };

  const handleEditMilestone = () => {
    if (editMilestone) {
      updateMilestoneName(
        editMilestone.milestoneId,
        newMilestoneName,
        newMilestoneDescription
      );
      setShowModal(false);
      setEditMilestone(null);
      setNewMilestoneName("");
      setNewMilestoneDescription("");
    }
  };

  if (!user) return null;

  return (
    <Container className="update-task-status all-status">
      <Button id="gobackteam" variant="secondary" onClick={() => navigate(-1)}>
        Go Back
      </Button>
      <Row className="top-row-status">
        <Col>
          <h1 id="updatetaskhead">Update Task Milestone</h1>
          <p>Drag and drop tasks to update their milestone.</p>
        </Col>
      </Row>
      <Row className="status-row">
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <DndProvider backend={HTML5Backend}>
            {milestones.map((milestone) => (
              <Column
                key={milestone.milestoneId}
                column={milestone}
                tasks={tasks.filter(
                  (task) => task.milestone.milestoneId === milestone.milestoneId
                )}
                moveTask={moveTask}
                openEditModal={openEditModal}
              />
            ))}
            <div className="status-column custom-col">
              <Button
                onClick={() => setShowModal(true)}
                className="add-milestone-btn"
              >
                + Add Milestone
              </Button>
            </div>
          </DndProvider>
        )}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMilestone ? "Edit Milestone" : "Create New Milestone"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="milestoneName">
              <Form.Label>Milestone Name</Form.Label>
              <Form.Control
                type="text"
                value={newMilestoneName}
                onChange={(e) => setNewMilestoneName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="milestoneDescription">
              <Form.Label>Milestone Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newMilestoneDescription}
                onChange={(e) => setNewMilestoneDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={
              editMilestone ? handleEditMilestone : handleCreateMilestone
            }
          >
            {editMilestone ? "Update Milestone" : "Create Milestone"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UpdateTaskStatus;
