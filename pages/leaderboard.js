import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import React from "react";

export default function Leaderboard() {
  const [alivePlayers, setAlivePlayers] = useState([]);
  const [deadPlayers, setDeadPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);

      const { data: alive, error: aliveError } = await supabase
        .from("grape_or_grave_stats")
        .select(`
          player_id,
          grapes_eaten,
          is_dead,
          players (
            name,
            bank_balance
          )
        `)
        .eq("is_dead", false)
        .limit(10);

      const { data: dead, error: deadError } = await supabase
        .from("grape_or_grave_stats")
        .select(`
          player_id,
          grapes_eaten,
          is_dead,
          players (
            name,
            bank_balance
          )
        `)
        .eq("is_dead", true)
        .limit(10);

      if (aliveError || deadError) {
        console.error("Error loading leaderboard:", aliveError || deadError);
        setLoading(false);
        return;
      }

      // Sort both manually by bank_balance descending
      const sortedAlive = alive
        .filter((entry) => entry.players)
        .sort((a, b) => b.players.bank_balance - a.players.bank_balance);

      const sortedDead = dead
        .filter((entry) => entry.players)
        .sort((a, b) => b.players.bank_balance - a.players.bank_balance);

      setAlivePlayers(sortedAlive);
      setDeadPlayers(sortedDead);
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  return (
    <main style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1 style={{ color: "var(--link-color)" }}>🏆 Leaderboard - Top Players</h1>

      {loading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <>
          <section>
            <h2>😊 Alive Players</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #444" }}>Name</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #444" }}>Balance ($)</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #444" }}>Grapes Eaten</th>
                </tr>
              </thead>
              <tbody>
                {alivePlayers.map(({ players, grapes_eaten }, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#222" : "#1a1a1a" }}>
                    <td style={{ padding: "8px" }}>{players.name || "Anonymous"}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>{players.bank_balance.toLocaleString()}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>{grapes_eaten}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section style={{ marginTop: 40 }}>
            <h2 style={{ color: "#cf6679" }}>☠️ Dead Players</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #444" }}>Name</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #444" }}>Balance ($)</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #444" }}>Grapes Eaten</th>
                </tr>
              </thead>
              <tbody>
                {deadPlayers.map(({ players, grapes_eaten }, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#222" : "#1a1a1a" }}>
                    <td style={{ padding: "8px" }}>{players.name || "Anonymous"}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>{players.bank_balance.toLocaleString()}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>{grapes_eaten}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      <p style={{ marginTop: 20 }}>
        <Link href="/grape-or-grave" legacyBehavior>
          <a>← Back to Game</a>
        </Link>
      </p>
      <p style={{ marginTop: 10 }}>
        <Link href="/hub" legacyBehavior>
          <a>← Back to Hub</a>
        </Link>
      </p>
    </main>
  );
}
