import { useOption } from "../../context/OptionProvider/OptionProvider";
import styles from "./Option.module.scss";

export default function Option() {
  const { state, dispatch } = useOption();
  return (
    <div className={styles.option}>
      <input
        type="text"
        placeholder="جستجو بر اساس نام، ایمیل یا شماره..."
        value={state.search}
        onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
      />
      <select
        value={state.sort}
        onChange={(e) => dispatch({ type: "SET_SORT", payload: e.target.value })}
      >
        <option value="newest">جدیدترین</option>
        <option value="oldest">قدیمی‌ترین</option>
        <option value="name">بر اساس نام</option>
      </select>
    </div>
  );
}
