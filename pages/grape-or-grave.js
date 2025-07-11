import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";


export default function GrapeOrGrave() {
  const [player, setPlayer] = useState(null);
  const [gameStats, setGameStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("eating"); // "eating" | "dead"
  const router = useRouter();

  useEffect(() => {
    const savedId = localStorage.getItem("playerId");
    if (savedId) {
      loadPlayerData(savedId);
    } else {
      router.replace("/login");
    }
  }, []);

  async function loadPlayerData(id) {
    setLoading(true);

    const { data: playerData, error: playerError } = await supabase
      .from("players")
      .select()
      .eq("id", id)
      .single();

    const { data: statsData, error: statsError } = await supabase
      .from("grape_or_grave_stats")
      .select()
      .eq("player_id", id)
      .single();

    if (playerError || statsError || !playerData || !statsData) {
      console.error("Failed to load data:", playerError, statsError);
      localStorage.removeItem("playerId");
      router.replace("/login");
      return;
    }

    setPlayer(playerData);
    setGameStats(statsData);
    setStatus(statsData.is_dead ? "dead" : "eating");
    setLoading(false);
  }

  async function eatGrape() {
    if (!player || !gameStats || status === "dead") return;

    setLoading(true);
    const nextGrape = gameStats.grapes_eaten + 1;

    if (nextGrape === gameStats.death_grape_number) {
      // Player dies
      const { data: updatedStats, error: updateError } = await supabase
        .from("grape_or_grave_stats")
        .update({ grapes_eaten: nextGrape, is_dead: true })
        .eq("player_id", player.id)
        .select()
        .single();

      if (updateError) {
        console.error("Failed to update stats (death):", updateError);
        setLoading(false);
        return;
      }

      setGameStats(updatedStats);
      setStatus("dead");
    } else {
      // Player survives — add $1,000 to bank balance
      const newBalance = player.bank_balance + 1000;

      const { data: updatedPlayer, error: playerUpdateError } = await supabase
        .from("players")
        .update({ bank_balance: newBalance })
        .eq("id", player.id)
        .select()
        .single();

      const { data: updatedStats, error: statsUpdateError } = await supabase
        .from("grape_or_grave_stats")
        .update({ grapes_eaten: nextGrape })
        .eq("player_id", player.id)
        .select()
        .single();

      if (playerUpdateError || statsUpdateError) {
        console.error("Failed to update after eating grape:", playerUpdateError, statsUpdateError);
        setLoading(false);
        return;
      }

      setPlayer(updatedPlayer);
      setGameStats(updatedStats);
    }

    setLoading(false);
  }

  if (!player || !gameStats) return null;

  return (
    <main className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-5xl font-extrabold text-purple-600 dark:text-purple-400 mb-4">
        🍇 Grape or Grave 🍇
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
        Eat grapes. Each grape earns you <b>$1,000</b> — but one random grape is deadly.
        If you eat the deadly grape, it's game over. How many grapes can you eat without dying?
      </p>

      <h2 className="text-lg font-semibold mb-1">Player: {player.name}</h2>
      <h3 className="text-md mb-1">💰 Balance: ${player.bank_balance.toLocaleString()}</h3>
      <h4 className="text-md mb-6">🍇 Grapes Eaten: {gameStats.grapes_eaten}</h4>

      {status === "dead" ? (
        <h2 className="text-red-500 text-xl mb-6">☠️ You ate the deadly grape! Game Over.</h2>
      ) : (
        <button
          onClick={eatGrape}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded text-lg hover:bg-purple-700 transition"
        >
          {loading ? "Eating..." : "Eat a Grape"}
        </button>
      )}

      <div className="mt-6 space-y-2">
        <Link href="/leaderboard" className="block text-purple-500 hover:underline">
          📊 View Leaderboard
        </Link>
        <Link href="/hub" className="block text-purple-500 hover:underline">
          ← Back to Hub
        </Link>
      </div>
    </main>
  );
}
