import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <h2>۴۰۴</h2>
      <p>صفحه مورد نظر پیدا نشد</p>
      <Link to="/">بازگشت به خانه</Link>
    </div>
  );
}
