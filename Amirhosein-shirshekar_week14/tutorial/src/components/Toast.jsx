function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast">
      <span>✓</span>
      {message}
    </div>
  );
}

export default Toast;
