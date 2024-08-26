import React, { useEffect, useState } from "react";
import "../css/ProjectPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import api from "./config/app";

import logo1 from "../media/1.jpg";
import logo2 from "../media/logo2.jpg";
import logo3 from "../media/3.png";
import logo4 from "../media/4.jpg";

const images = [logo1, logo2, logo3, logo4];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = location.state || {};

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");

        let filteredProjects = response.data;

        if (user && user.userRole === "PROJECT_MANAGER") {
          filteredProjects = filteredProjects.filter(
            (project) =>
              project.manager && project.manager.userId === user.userId
          );
        }

        const shuffledImages = shuffleArray([...images]);
        const projectsWithImages = filteredProjects.map((project, index) => ({
          ...project,
          image: shuffledImages[index % shuffledImages.length],
        }));

        setProjects(projectsWithImages);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [user]);

  return (
    <div className="containers">
      <div className="row-project">
        {projects.map((project) => (
          <div
            className="col-lg-3 col-md-6 col-s-12 mb-4"
            key={project.projectId}
          >
            <div className="card-menu">
              <img
                src={project.image}
                className="card-img-top-project"
                alt={project.projectName}
              />
              <div className="card2-body">
                <div className="title-description-group">
                  <h5 className="card-title">
                    <b>{project.projectName}</b>
                  </h5>
                  <p className="card-text">
                    {project.description || "No description available."}
                  </p>
                </div>
                <div className="btn-center">
                  <button
                    onClick={() =>
                      navigate(
                        `/project-details-menu/${project.projectId}/project-dashboard/${project.projectId}`
                      )
                    }
                    className="btn btn-outline-primary project-manager-button"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectPage;
