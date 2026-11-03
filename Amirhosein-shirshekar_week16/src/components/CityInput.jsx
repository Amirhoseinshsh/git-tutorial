import { useState } from "react";
import { getSuggestions } from "../utils/suggest";
import cities from "../data/cities";

export default function CityInput() {
  const [value, setValue] = useState("");
  const [active, setActive] = useState(0); // کدام پیشنهاد با کیبورد انتخاب شده

  const suggestions = getSuggestions(value, cities);
  // اگر ورودی دقیقاً برابر یک شهر است، دیگر پیشنهاد نشان نده
  const visible = suggestions.length > 0 && suggestions[0] !== value;

  const choose = (city) => {
    setValue(city);
    setActive(0);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    setActive(0);
  };

  const handleKeyDown = (e) => {
    if (!visible) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();
      choose(suggestions[active]);
    }
  };

  return (
    <div className="city-input">
      <input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a city name..."
        autoComplete="off"
        spellCheck="false"
      />

      {visible && (
        <ul className="suggestions">
          {suggestions.map((city, index) => (
            <li
              key={city}
              className={index === active ? "active" : ""}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}

      {value && suggestions.length === 0 && (
        <p className="hint">شهری پیدا نشد</p>
      )}
    </div>
  );
}
