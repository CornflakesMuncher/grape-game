import React, { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }
    localStorage.setItem("playerName", playerName.trim());
    router.push("/hub");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">🍇 Welcome to Grape World</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300"
        />
        <button
          onClick={handleStart}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Enter Hub
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
