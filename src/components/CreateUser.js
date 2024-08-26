import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CreateUser.css";

const CreateUser = () => {
  const initialFormData = {
    userId: "",
    userName: "",
    userRole: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    status: "ACTIVE",
    dateOfJoining: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [userCount, setUserCount] = useState(0);
  const [passwordConstraints, setPasswordConstraints] = useState({
    length: false,
    letter: false,
    digit: false,
    specialChar: false,
  });

  useEffect(() => {
    axios
      .get(
        "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/admin/users"
      )
      .then((response) => {
        const nextUserId = response.data.length + 1;
        console.log("Next User ID:", nextUserId);
        setFormData((prevData) => ({
          ...prevData,
          userId: nextUserId,
        }));
        setUserCount(response.data.length);
      })
      .catch((error) => {
        console.error("There was an error fetching the list of users!", error);
      });
  }, [userCount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      // Update password constraints
      setPasswordConstraints({
        length: value.length >= 7,
        letter: /[a-zA-Z]/.test(value),
        digit: /\d/.test(value),
        specialChar: /[@_]/.test(value),
      });
    }
  };

  const validatePassword = (password) => {
    // Password must be at least 7 characters long, alphanumeric, and contain at least one special character (@ or _)
    const isValid =
      password.length >= 7 &&
      /[a-zA-Z]/.test(password) &&
      /\d/.test(password) &&
      /[@_]/.test(password);
    return isValid;
  };

  const validateAndSubmitForm = () => {
    const {
      userName,
      userRole,
      email,
      password,
      phone,
      specialization,
      dateOfJoining,
    } = formData;
    console.log("Form data before validation:", formData);

    // Check if any field is empty
    if (
      !userName ||
      !userRole ||
      !email ||
      !password ||
      !phone ||
      !specialization ||
      !dateOfJoining
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      alert(
        "Password must be at least 7 characters long, alphanumeric, and contain at least one special character (@ or _)."
      );
      return;
    }

    axios
      .post(
        "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/admin/registration",
        formData
      )
      .then((response) => {
        console.log("Form data submitted:", response.data);
        alert("User created successfully!");
        setUserCount(userCount + 1);
        setFormData(initialFormData);
        setPasswordConstraints({
          length: false,
          letter: false,
          digit: false,
          specialChar: false,
        });
      })
      .catch((error) => {
        console.error("There was an error creating the user!", error);
        alert("There was an error creating the user!");
      });
  };

  return (
    <div className="registration-form-container">
      <h2 className="registration-form-title">Create User</h2>
      <form id="userForm" className="registration-user-form">
        <label htmlFor="userName" className="registration-form-label">
          Name:
        </label>
        <input
          type="text"
          id="userName"
          name="userName"
          className="registration-form-input"
          value={formData.userName}
          onChange={handleChange}
          required
        />
        <br className="registration-form-break" />

        <label htmlFor="userRole" className="registration-form-label">
          Role:
        </label>
        <select
          id="userRole"
          name="userRole"
          className="registration-form-select"
          value={formData.userRole}
          onChange={handleChange}
          required
        >
          <option value="" className="registration-form-option">
            Select Role
          </option>
          <option value="ADMIN" className="registration-form-option">
            ADMIN
          </option>
          <option value="PROJECT_MANAGER" className="registration-form-option">
            PROJECT_MANAGER
          </option>
          <option value="TEAM_MEMBER" className="registration-form-option">
            TEAM_MEMBER
          </option>
        </select>
        <br className="registration-form-break" />

        <label htmlFor="email" className="registration-form-label">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="registration-form-input"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br className="registration-form-break" />

        <label htmlFor="password" className="registration-form-label">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="registration-form-input"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br className="registration-form-break" />

        <div className="password-requirements">
          <p>
            <strong>Password Requirements:</strong>
          </p>
          <ul>
            <li className={passwordConstraints.length ? "fulfilled" : ""}>
              At least 7 characters long
            </li>
            <li className={passwordConstraints.letter ? "fulfilled" : ""}>
              Includes at least one letter
            </li>
            <li className={passwordConstraints.digit ? "fulfilled" : ""}>
              Includes at least one digit
            </li>
            <li className={passwordConstraints.specialChar ? "fulfilled" : ""}>
              Contains at least one special character: <strong>@</strong> or{" "}
              <strong>_</strong>
            </li>
          </ul>
        </div>

        <label htmlFor="phone" className="registration-form-label">
          Phone:
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="registration-form-input"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <br className="registration-form-break" />

        <label htmlFor="specialization" className="registration-form-label">
          Specialization:
        </label>
        <input
          type="text"
          id="specialization"
          name="specialization"
          className="registration-form-input"
          value={formData.specialization}
          onChange={handleChange}
          required
        />
        <br className="registration-form-break" />

        <label htmlFor="dateOfJoining" className="registration-form-label">
          Date of Joining:
        </label>
        <input
          type="date"
          id="dateOfJoining"
          name="dateOfJoining"
          className="registration-form-input"
          value={formData.dateOfJoining}
          onChange={handleChange}
          required
        />
        <br className="registration-form-break" />

        <button
          type="button"
          className="registration-form-button common"
          onClick={validateAndSubmitForm}
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
