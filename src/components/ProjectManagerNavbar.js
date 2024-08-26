import React from "react";
import "../css/ProjectManagerNavbar.css";
import { Link } from "react-router-dom";

const ProjectManagerNavbar = ({ setActiveSection }) => {
  return (
    <div className="project-manager-navbar-container">
      <nav className="project-manager-navbar">
        <button
          className="project-manager-nav-item"
          onClick={() => setActiveSection("projects")}
        >
          Projects
        </button>
        <button
          className="project-manager-nav-item"
          onClick={() => setActiveSection("clients")}
        >
          Clients
        </button>
        <button
          className="project-manager-nav-item"
          onClick={() => setActiveSection("users")}
        >
          TeamMemebers
        </button>
        <button
          className="project-manager-nav-item"
          onClick={() => setActiveSection("tasks")}
        >
          Tasks
        </button>
        <Link className="project-manager-logout-button" to="/login">
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default ProjectManagerNavbar;
