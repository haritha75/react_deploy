import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "./config/app";
import "../css/UserDetailsPage.css";

const UserDetailsPage = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/admin/users`);
        const allUsers = response.data;

        const filteredUsers = allUsers.filter(
          (user) => user.managerId === user.userId
        );

        setUserDetails(filteredUsers);
      } catch (error) {
        setError("Error fetching user details: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  return (
    <div className="user-details-container1">
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : userDetails.length > 0 ? (
        <div className="user-details-table">
          <div className="user-details-header">
            <div>User Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Specialization</div>
            <div>Date of Joining</div>
          </div>
          <div className="user-details-body">
            {userDetails.map((user) => (
              <div key={user.userId} className="user-details-row">
                <div>{user.userName}</div>
                <div>{user.email}</div>
                <div>{user.phone}</div>
                <div>{user.specialization}</div>
                <div>{new Date(user.dateOfJoining).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No users found for your management.</p>
      )}
    </div>
  );
};

export default UserDetailsPage;
