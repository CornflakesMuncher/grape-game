// pages/login.js
import React, { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 const handleStart = async () => {
  const trimmedName = nameInput.trim();

  if (!trimmedName) {
    setError("Please enter a name");
    return;
  }

  setLoading(true);
  setError("");

  // Check if name already exists
  const { data: existingPlayer, error: fetchError } = await supabase
    .from("players")
    .select("id")
    .eq("name", trimmedName)
    .maybeSingle();

  if (fetchError) {
    setError("Error checking name. Try again.");
    console.error(fetchError);
    setLoading(false);
    return;
  }

  if (existingPlayer) {
    setError("Name already in use. Please choose another.");
    setLoading(false);
    return;
  }

  // Step 1: Create new player in `players` table
  const { data: newPlayer, error: insertError } = await supabase
    .from("players")
    .insert([
      {
        name: trimmedName,
        bank_balance: 0,
      },
    ])
    .select()
    .single();

  if (insertError) {
    setError("Failed to create player.");
    console.error("Insert error (players):", insertError);
    setLoading(false);
    return;
  }

  // Step 2: Create stats row for Grape or Grave
  const deathGrape = Math.floor(Math.random() * 1000) + 1;
  const { error: statsError } = await supabase
    .from("grape_or_grave_stats")
    .insert([
      {
        player_id: newPlayer.id,
        grapes_eaten: 0,
        is_dead: false,
        death_grape_number: deathGrape,
      },
    ]);

  if (statsError) {
    setError("Failed to initialize game stats.");
    console.error("Insert error (grape_or_grave_stats):", statsError);
    setLoading(false);
    return;
  }

  // Save player ID and redirect
  localStorage.setItem("playerId", newPlayer.id);
  router.replace("/hub");
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">🍇 Welcome to Grape Hub</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter your name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300"
          disabled={loading}
        />
        <button
          onClick={handleStart}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Enter Hub"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
}
