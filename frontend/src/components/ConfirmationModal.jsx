import React from "react";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onCancel}>
            Nie
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Tak
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;