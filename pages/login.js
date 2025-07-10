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

    // Create new player
    const deathGrape = Math.floor(Math.random() * 1000) + 1;
    const { data: newPlayer, error: insertError } = await supabase
      .from("players")
      .insert([
        {
          name: trimmedName,
          grapes_eaten: 0,
          bank_balance: 0,
          is_dead: false,
          death_grape_number: deathGrape,
        },
      ])
      .select()
      .single();

    if (insertError) {
      setError("Failed to create player.");
      console.error(insertError);
      setLoading(false);
      return;
    }

    // Save ID and redirect to hub
    localStorage.setItem("playerId", newPlayer.id);
    router.replace("/hub");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">🍇 Welcome to Grape World</h1>
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
