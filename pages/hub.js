import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";

// ⬇️ Support footer component
function SupportFooter() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`transition-all duration-300 fixed bottom-0 left-0 w-full bg-purple-100 dark:bg-purple-900 text-center text-sm p-4 shadow-md z-50 ${
        open ? "" : "translate-y-full"
      }`}
    >
      {open && (
        <div className="flex justify-between items-center px-4">
          <span className="text-purple-800 dark:text-purple-100">
            🍇 Enjoying GrapeHub? Support the creator, suggest a feature or just tell me what you enjoy about the games!
          </span>
          <div className="flex gap-2">
            <a
              href="https://buy.stripe.com/test_bIY4j6cQv2RA4Sk3cd"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
            >
              Donate 💰
            </a>
            <a
              href="mailto:mechatyronics@gmail.com"
              className="bg-purple-300 text-purple-900 px-3 py-1 rounded hover:bg-purple-400"
            >
              Contact Developer 💡
            </a>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="absolute right-4 -top-4 bg-purple-400 text-white px-2 py-1 rounded-t shadow"
      >
        {open ? "▼" : "▲"}
      </button>
    </div>
  );
}

// ⬇️ Main Hub component
export default function Hub() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const router = useRouter();

  const games = [
    { id: "grape-or-grave", title: "Grape or Grave", playable: true },
    { id: "coming-soon-1", title: "Coming Soon", playable: false },
    { id: "coming-soon-2", title: "Coming Soon", playable: false },
    { id: "coming-soon-3", title: "Coming Soon", playable: false },
    { id: "coming-soon-4", title: "Coming Soon", playable: false },
    { id: "coming-soon-5", title: "Coming Soon", playable: false },
    { id: "coming-soon-6", title: "Coming Soon", playable: false },
    { id: "coming-soon-7", title: "Coming Soon", playable: false },
    { id: "coming-soon-8", title: "Coming Soon", playable: false },
    { id: "coming-soon-9", title: "Coming Soon", playable: false },
  ];

  useEffect(() => {
    const fetchPlayer = async () => {
      const storedId = localStorage.getItem("playerId");
      if (!storedId) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("players")
        .select()
        .eq("id", storedId)
        .single();

      if (error || !data) {
        console.error("Failed to load player:", error);
        localStorage.removeItem("playerId");
        router.replace("/login");
        return;
      }

      setPlayer(data);
      setLoading(false);
    };

    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("players")
        .select(`
          id,
          name,
          bank_balance,
          grape_or_grave_stats (
            is_dead
          )
        `)
        .order("bank_balance", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Failed to load leaderboard:", error);
        return;
      }

      // Flatten is_dead from grape_or_grave_stats (array of 1 per player)
      const formattedData = data.map((p) => ({
        ...p,
        is_dead: Array.isArray(p.grape_or_grave_stats)
          ? p.grape_or_grave_stats.some((s) => s.is_dead === true)
          : false,
      }));

      setLeaderboard(formattedData);
    };

    fetchPlayer();
    fetchLeaderboard();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white px-6 py-4 transition-colors duration-300">
      {/* Top left player name */}
      <div className="absolute top-4 left-4 text-sm text-purple-500 dark:text-purple-300">
        Welcome, {player?.name}
      </div>

      {/* Center title */}
      <div className="text-center mt-12">
        <h1
          className="text-5xl font-extrabold text-purple-600 dark:text-purple-400"
          style={{ whiteSpace: "nowrap" }}
        >
          🍇 GrapeHub 🍇
        </h1>
      </div>

      {/* Game scroll row */}
      <div className="mt-20 mb-12 px-4 pb-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-300 dark:scrollbar-thumb-purple-300 dark:scrollbar-track-gray-700">
        {games.map((game) => (
          <div
            key={game.id}
            className="inline-block align-top mx-3 text-center"
          >
            {/* Game Cover */}
            <div className="w-56 h-80 rounded-lg shadow-lg flex flex-col p-4 bg-black relative overflow-hidden">
              <Image
                src={`/images/${game.id}-cover.png`}
                alt={`${game.title} Cover`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg opacity-90"
              />
              {/* Spacer pushes buttons down */}
              <div className="flex-grow" />
              <div className="relative z-10 flex flex-col gap-2">
                {game.playable ? (
                  <>
                    <button
                      onClick={() => router.push(`/${game.id}`)}
                      className="bg-black dark:bg-white dark:text-black text-white text-sm px-3 py-1 rounded hover:opacity-80 transition"
                    >
                      🕹️ Play Game
                    </button>
                    <button
                      onClick={() => router.push("/leaderboard")}
                      className="bg-black dark:bg-white dark:text-black text-white text-sm px-3 py-1 rounded hover:opacity-80 transition"
                    >
                      📊 Leaderboard
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-purple-200 italic text-sm">
                    Coming Soon
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 text-lg font-medium">{game.title}</div>
          </div>
        ))}
      </div>

      {/* Global Leaderboard */}
      <section className="max-w-md mx-auto mt-12">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Global Leaderboard
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-400 px-3 py-2">Rank</th>
              <th className="border-b border-gray-400 px-3 py-2">Name</th>
              <th className="border-b border-gray-400 px-3 py-2 text-right">
                Bank Balance ($)
              </th>
              <th className="border-b border-gray-400 px-3 py-2 text-center">
                ●
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((p, i) => (
              <tr
                key={p.id}
                className={i % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : ""}
              >
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2 text-right">
                  {p.bank_balance.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-center">
                  {p.is_dead ? "💀" : "🟢"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Sticky Support Banner */}
      <SupportFooter />
    </div>
  );
}
