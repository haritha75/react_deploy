import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/ViewProjectClientDetails.css";

const ProjectClientDetails = () => {
  const { projectId } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);

        const projectResponse = await axios.get(
          `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/projects/${projectId}`
        );

        if (projectResponse.data && projectResponse.data.client) {
          setClient(projectResponse.data.client);
        } else {
          throw new Error("Client information not found in project data.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [projectId]);

  if (loading) {
    return <div className="container-v">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container-v">
        <div className="alert alert-danger">Error: {error}</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container-v">
        <div className="alert alert-warning">No client data available</div>
      </div>
    );
  }

  return (
    <div className="container-v">
      <div className="info-panel">
        <div className="info-header">Client Details</div>
        <div className="info-row">
          <div className="info-section">
            <div className="info-title">Client Name</div>
            <div className="info-content">{client.clientName}</div>
          </div>
          <div className="info-section">
            <div className="info-title">Email</div>
            <div className="info-content">{client.clientEmail}</div>
          </div>
          <div className="info-section">
            <div className="info-title">Phone Number</div>
            <div className="info-content">{client.clientPhone}</div>
          </div>
          <div className="info-section">
            <div className="info-title">Company Name</div>
            <div className="info-content">{client.clientCompanyName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectClientDetails;
