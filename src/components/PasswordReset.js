import React, { useState, useEffect } from "react";
import axios from "axios";
import logopassword from "../media/passwordreset.png";
import "../css/PasswordReset.css";

const PasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(120);
  const [otpExpired, setOtpExpired] = useState(false);
  const [passwordConstraints, setPasswordConstraints] = useState({
    length: false,
    letter: false,
    digit: false,
    specialChar: false,
  });

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleTokenChange = (e) => setToken(e.target.value);
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    // Update password constraints
    setPasswordConstraints({
      length: value.length >= 7,
      letter: /[a-zA-Z]/.test(value),
      digit: /\d/.test(value),
      specialChar: /[@_]/.test(value),
    });
  };
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const validatePassword = (password) => {
    // Password must be at least 7 characters long, alphanumeric, and contain at least one special character (@ or _)
    return (
      password.length >= 7 &&
      /[a-zA-Z]/.test(password) &&
      /\d/.test(password) &&
      /[@_]/.test(password)
    );
  };

  const handleRequestReset = (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }

    axios
      .post(
        "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/requestPasswordReset",
        { email }
      )
      .then((response) => {
        alert("An OTP has been sent to your email.");
        setStep(2);
        setTimer(120);
        setOtpExpired(false);
      })
      .catch((error) => {
        setErrorMessage(
          "Error requesting password reset—this email may not be registered yet."
        );
      });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!token || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrorMessage(
        "Password must be at least 7 characters long, alphanumeric, and contain at least one special character (@ or _)."
      );
      return;
    }

    axios
      .post(
        "https://taskmanagementspringboot-aahfeqggang5fdee.southindia-01.azurewebsites.net/api/resetPassword",
        {
          token,
          newPassword,
          confirmPassword,
        }
      )
      .then((response) => {
        alert("Password updated successfully!");
        window.location.href = "/login";
      })
      .catch((error) => {
        setErrorMessage("There was an error resetting the password!");
      });
  };

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      setOtpExpired(true);
    }
  }, [step, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="passwordreset">
      <button className="go-back-button" onClick={() => window.history.back()}>
        Go Back
      </button>
      <div className="flex-container-pw">
        <img src={logopassword} alt="Logo" className="logo-pw" />
        <div className="pw-container">
          <h1 className="h1styles">Let's Reset Your Password</h1>
          {step === 1 ? (
            <form id="request-reset-form" onSubmit={handleRequestReset}>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label-pw">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control-pw"
                  id="exampleInputEmail1"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              <div className="button-container-pw">
                <button type="submit" className="btn reset-button">
                  Get OTP
                </button>
              </div>
            </form>
          ) : (
            <form id="reset-password-form" onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label htmlFor="exampleInputToken1" className="form-label-pw">
                  OTP
                </label>
                <input
                  type="text"
                  className="form-control-pw"
                  id="exampleInputToken1"
                  value={token}
                  onChange={handleTokenChange}
                  required
                  disabled={otpExpired}
                />
              </div>
              <div className="otp-timer">
                {otpExpired ? (
                  <div className="error-message">Your OTP has expired.</div>
                ) : (
                  <div className="timer">
                    Your OTP expires in {formatTime(timer)}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputNewPassword1"
                  className="form-label-pw"
                >
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control-pw"
                  id="exampleInputNewPassword1"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                />
              </div>

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
                  <li
                    className={
                      passwordConstraints.specialChar ? "fulfilled" : ""
                    }
                  >
                    Contains at least one special character: <strong>@</strong>{" "}
                    or <strong>_</strong>
                  </li>
                </ul>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="exampleInputConfirmPassword1"
                  className="form-label-pw"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control-pw"
                  id="exampleInputConfirmPassword1"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                />
              </div>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              <div className="button-container-pw">
                <button type="submit" className="btn reset-button">
                  Reset Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
