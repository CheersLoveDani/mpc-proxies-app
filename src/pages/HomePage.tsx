import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

export const HomePage = () => {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="page">
      <h1>Welcome to MTG Proxies App</h1>
      <p>Your home for creating Magic: The Gathering proxy cards.</p>

      <div className="greet-section">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="input"
          />
          <button type="submit" className="btn btn-primary">
            Greet
          </button>
        </form>
        {greetMsg && <p className="greet-message">{greetMsg}</p>}
      </div>
    </div>
  );
};
