import React from "react";
import "../css/Modal.css";

const Modal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay-modal show">
      <div className="modal-content-modal show">
        <h2>Confirmation</h2>
        <p>Are you sure you want to remove this team member?</p>
        <div className="modal-buttons-modal">
          <button className="btn-confirm-modal" onClick={onConfirm}>
            Yes
          </button>
          <button className="btn-cancel-modal" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
