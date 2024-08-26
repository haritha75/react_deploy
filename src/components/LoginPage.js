import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo2 from "../media/login.png";
import "../css/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById("exampleInputEmail1").value;
    const password = document.getElementById("exampleInputPassword1").value;

    if (!email || !password) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      const response = await fetch(
        `https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/login?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const user = await response.json();

        if (user.status !== "ACTIVE") {
          setMessage("Your account is inactive. Please contact the admin.");
          return;
        }

        if (user.userRole === "ADMIN") {
          navigate("/admin");
        } else if (user.userRole === "TEAM_MEMBER") {
          navigate("/team-member", { state: { user } });
        } else if (user.userRole === "PROJECT_MANAGER") {
          navigate("/project-manager/projects", { state: { user } });
        }
      } else {
        setMessage("Invalid email or password.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page-body">
      <div className="image-container-login">
        <img className="login-image" src={logo2} alt="login" />
      </div>
      <div className="login-container">
        <h1 className="login-title">Welcome to Synergize</h1>
        <form id="login-form">
          <div className="mb-3">
            <label
              htmlFor="exampleInputEmail1"
              className="form-label login-label"
            >
              Email
            </label>
            <input
              type="email"
              className="form-control login-input"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label
              htmlFor="exampleInputPassword1"
              className="form-label login-label"
            >
              Password
            </label>
            <input
              type="password"
              className="form-control login-input"
              id="exampleInputPassword1"
            />
          </div>
          <div className="button-container-login">
            <button
              type="submit"
              className="btn loginbutton"
              onClick={handleLogin}
            >
              Login
            </button>
            <Link to="/password-reset">
              <button type="button" className="btn loginbutton reset">
                Reset Password
              </button>
            </Link>
          </div>
        </form>
        {message && <div id="message">{message}</div>}
      </div>
    </div>
  );
};

export default LoginPage;
