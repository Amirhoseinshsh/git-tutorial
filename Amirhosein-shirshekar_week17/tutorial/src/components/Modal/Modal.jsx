import styles from "./Modal.module.scss";

export default function Modal({ title, message, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.confirm} onClick={onConfirm}>بله، حذف شود</button>
          <button className={styles.cancel} onClick={onCancel}>انصراف</button>
        </div>
      </div>
    </div>
  );
}
