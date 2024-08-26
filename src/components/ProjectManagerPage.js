import React, { useState } from "react";
import ProjectManagerNavbar from "./ProjectManagerNavbar";
import ProjectPage from "./ProjectPage";
import ClientDetailsPage from "./ClientDetailsPage";
import UserDetailsPage from "./UserDetailsPage";
import TasksPageForManager from "./TasksPageForManager";

const ProjectManagerPage = () => {
  const [activeSection, setActiveSection] = useState("projects");

  const renderSection = () => {
    switch (activeSection) {
      case "projects":
        return <ProjectPage />;
      case "clients":
        return <ClientDetailsPage />;
      case "users":
        return <UserDetailsPage />;
      case "tasks":
        return <TasksPageForManager />;
      default:
        return <ProjectPage />;
    }
  };

  return (
    <div>
      <ProjectManagerNavbar setActiveSection={setActiveSection} />
      <div>{renderSection()}</div>
    </div>
  );
};

export default ProjectManagerPage;
