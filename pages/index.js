import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import React from 'react';


export default function Home() {
  const [player, setPlayer] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("eating"); // "eating" | "dead" | "intro"
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem("playerId");
    if (savedId) {
      loadPlayer(savedId);
    } else {
      setIntroDone(false);
    }
  }, []);

  async function loadPlayer(id) {
    setLoading(true);
    const { data, error } = await supabase
      .from("players")
      .select()
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Error loading player:", error);
      localStorage.removeItem("playerId");
      setIntroDone(false);
      setLoading(false);
      return;
    }

    setPlayer(data);
    setStatus(data.is_dead ? "dead" : "eating");
    setIntroDone(true);
    setLoading(false);
  }

  async function createPlayer() {
    if (!nameInput.trim()) return alert("Please enter your name");

    setLoading(true);
    const deathGrape = Math.floor(Math.random() * 1000) + 1;
    const { data, error } = await supabase
      .from("players")
      .insert([
        {
          name: nameInput.trim(),
          grapes_eaten: 0,
          bank_balance: 0,
          is_dead: false,
          death_grape_number: deathGrape,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating player:", error);
      alert("Failed to create player. Try again.");
      setLoading(false);
      return;
    }

    localStorage.setItem("playerId", data.id);
    setPlayer(data);
    setStatus("eating");
    setIntroDone(true);
    setLoading(false);
  }

  async function eatGrape() {
    if (!player || player.is_dead) return;

    setLoading(true);
    const nextGrape = player.grapes_eaten + 1;

    if (nextGrape === player.death_grape_number) {
      const { data, error } = await supabase
        .from("players")
        .update({ grapes_eaten: nextGrape, is_dead: true })
        .eq("id", player.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating player (dead):", error);
        setLoading(false);
        return;
      }

      setPlayer(data);
      setStatus("dead");
      setLoading(false);
    } else {
      const newBalance = player.bank_balance + 100000;

      const { data, error } = await supabase
        .from("players")
        .update({ grapes_eaten: nextGrape, bank_balance: newBalance })
        .eq("id", player.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating player:", error);
        setLoading(false);
        return;
      }

      setPlayer(data);
      setLoading(false);
    }
  }

  if (!introDone) {
    // Show intro + rules + name input screen
    return (
      <main style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
        <h1 style={{ color: "var(--link-color)" }}>🍇 Grape or Grave</h1>
        <p>
          Eat grapes. Each grape you eat earns you <b>R100,000</b> — but one random grape is deadly.
          If you eat the deadly grape, it's game over. How many grapes can you eat without dying?
        </p>
        <input
          type="text"
          placeholder="Enter your name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            width: "100%",
            marginTop: 10,
            backgroundColor: "#222",
            border: "1px solid #444",
            color: "#eee",
            borderRadius: 4,
          }}
          disabled={loading}
        />
        <button onClick={createPlayer} disabled={loading} style={{ marginTop: 15, width: "100%" }}>
          {loading ? "Starting..." : "Start Playing"}
        </button>
        <p style={{ marginTop: 20 }}>
          <Link href="/leaderboard" legacyBehavior>
            <a>View Leaderboard</a>
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20, textAlign: "center" }}>
      <h1 style={{ color: "var(--link-color)" }}>🍇 Grape or Grave</h1>
      <h2>Player: {player.name}</h2>
      <h3>💰 Balance: R{player.bank_balance.toLocaleString()}</h3>
      <h4>🍇 Grapes Eaten: {player.grapes_eaten}</h4>

      {status === "dead" ? (
        <h2 style={{ color: "#cf6679", marginTop: 40 }}>☠️ You ate the deadly grape! Game Over.</h2>
      ) : (
        <button
          onClick={eatGrape}
          disabled={loading}
          style={{ marginTop: 40, fontSize: "1.5rem", cursor: loading ? "wait" : "pointer" }}
        >
          {loading ? "Eating..." : "Eat a Grape"}
        </button>
      )}

      <p style={{ marginTop: 30 }}>
        <Link href="/leaderboard" legacyBehavior>
          <a>View Leaderboard</a>
        </Link>
      </p>
    </main>
  );
}
