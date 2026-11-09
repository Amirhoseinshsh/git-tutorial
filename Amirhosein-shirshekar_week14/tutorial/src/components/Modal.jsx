function Modal({ className = "", onClose, children }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal ${className}`}>{children}</div>
    </div>
  );
}

export default Modal;
