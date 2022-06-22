import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    if (replace === true) {
      history.splice(-1, 1)
    }
    setHistory([...history, mode])
  }

  function back() {
    if (history.length < 2) {
      return;
    }
    setHistory(history.slice(0, -1))
  }

  return { mode: history[history.length - 1], transition, back };
}