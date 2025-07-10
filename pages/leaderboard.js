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
        .from("players")
        .select("name, bank_balance, grapes_eaten")
        .eq("is_dead", false)
        .order("bank_balance", { ascending: false })
        .limit(10);

      const { data: dead, error: deadError } = await supabase
        .from("players")
        .select("name, bank_balance, grapes_eaten")
        .eq("is_dead", true)
        .order("bank_balance", { ascending: true })
        .limit(10);

      if (aliveError || deadError) {
        console.error("Error loading leaderboard:", aliveError || deadError);
        setLoading(false);
        return;
      }

      setAlivePlayers(alive);
      setDeadPlayers(dead);
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
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #444" }}>Balance (R)</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #444" }}>Grapes Eaten</th>
                </tr>
              </thead>
              <tbody>
                {alivePlayers.map(({ name, bank_balance, grapes_eaten }, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#222" : "#1a1a1a" }}>
                    <td style={{ padding: "8px" }}>{name || "Anonymous"}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>{bank_balance.toLocaleString()}</td>
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
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #444" }}>Balance (R)</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #444" }}>Grapes Eaten</th>
                </tr>
              </thead>
              <tbody>
                {deadPlayers.map(({ name, bank_balance, grapes_eaten }, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#222" : "#1a1a1a" }}>
                    <td style={{ padding: "8px" }}>{name || "Anonymous"}</td>
                    <td style={{ padding: "8px", textAlign: "right" }}>{bank_balance.toLocaleString()}</td>
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
