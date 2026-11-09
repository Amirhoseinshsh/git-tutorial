import { useAlert } from "../../context/AlertProvider/AlertProvider";
import styles from "./Alert.module.scss";

export default function Alert() {
  const { alert } = useAlert();
  if (!alert) return null;
  return (
    <div className={`${styles.alert} ${styles[alert.type]}`} role="alert">
      {alert.message}
    </div>
  );
}
