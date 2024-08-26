import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../css/AdminPage.css";
import logoadmin from "../media/adminpageimage.png"; 

const AdminPage = () => {
  const location = useLocation();

  const showImage = location.pathname === "/admin";

  return (
    <div className="admin-page-body">
      <div className="admin-page">
        <div className="admin-sidebar">
          <div>
            <h1>Welcome!</h1>
            <p style={{ color: "#f9f9f9" }}>Select an Action:</p>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/registration">Register a New User</Link>
            <Link to="/admin/update-user">Update an existing User</Link>
            <Link to="/admin/deactivate-user">Deactivate an existing User</Link>
            <Link to="/admin/assign-role">Assign Role to the User</Link>
            <Link to="/admin/create-client">Create a New Client</Link>
            <Link to="/admin/create-project">Create a new Project</Link>
            <Link to="/admin/user-details">Track User Details</Link>
            <Link to="/admin/monitor-task-details">Monitor Tasks Details</Link>
          </div>
          <Link className="admin-btn-primary" to="/login">
            Logout
          </Link>
        </div>
        <div className="admin-content" id="content">
          {showImage ? (
            <img
              src={logoadmin} alt="Admin" className="admin-page-image"
            />
          ) : 
          (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
