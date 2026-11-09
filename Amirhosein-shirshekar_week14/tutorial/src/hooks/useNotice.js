import { useState } from "react";

export function useNotice(duration = 2600) {
  const [notice, setNotice] = useState("");

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), duration);
  }

  return [notice, showNotice];
}
