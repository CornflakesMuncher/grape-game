import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";

export default function Hub() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [footerOpen, setFooterOpen] = useState(true);
  const router = useRouter();

  const games = [
    { id: "grape-or-grave", title: "Grape or Grave", playable: true },
    { id: "coming-soon-1", title: "Coming Soon", playable: false },
    { id: "coming-soon-2", title: "Coming Soon", playable: false },
    { id: "coming-soon-3", title: "Coming Soon", playable: false },
    { id: "coming-soon-4", title: "Coming Soon", playable: false },
    { id: "coming-soon-5", title: "Coming Soon", playable: false },
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

      const formattedData = data.map((p) => ({
        ...p,
        is_dead: p.grape_or_grave_stats?.is_dead ?? false,
      }));

      setLeaderboard(formattedData);
    };

    fetchPlayer();
    fetchLeaderboard();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white px-4 py-4 transition-colors duration-300">
      {/* Player Greeting */}
      <div className="absolute top-4 left-4 text-sm text-purple-500 dark:text-purple-300">
        Welcome, {player?.name}
      </div>

      {/* Title */}
      <div className="text-center mt-12 mb-8">
        <h1 className="text-5xl font-extrabold text-purple-600 dark:text-purple-400 whitespace-nowrap">
          🍇 GrapeHub 🍇
        </h1>
      </div>

      {/* Layout: Games + Leaderboard */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Game Tiles */}
        <div className="w-full lg:w-2/3">
          {/* Mobile: horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-6 lg:hidden">
            {games.map((game) => (
              <div key={game.id} className="flex-shrink-0 w-56 text-center">
                <div className="w-full h-80 relative rounded-lg shadow-lg bg-black overflow-hidden">
                  <Image
                    src={`/images/${game.id}-cover.png`}
                    alt={`${game.title} Cover`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg opacity-90"
                  />
                  <div className="absolute bottom-4 left-0 right-0 z-10 flex flex-col items-center gap-2">
                    {game.playable ? (
                      <>
                        <button
                          onClick={() => router.push(`/${game.id}`)}
                          className="bg-white text-black text-sm px-3 py-1 rounded hover:opacity-80"
                        >
                          🕹️ Play Game
                        </button>
                        <button
                          onClick={() => router.push("/leaderboard")}
                          className="bg-purple-300 text-purple-900 text-sm px-3 py-1 rounded hover:bg-purple-400"
                        >
                          📊 Leaderboard
                        </button>
                      </>
                    ) : (
                      <div className="text-purple-200 italic text-sm">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-lg font-medium">{game.title}</div>
              </div>
            ))}
          </div>

          {/* Desktop: grid layout */}
          <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-6">
            {games.map((game) => (
              <div key={game.id} className="text-center">
                <div className="relative w-full h-80 rounded-lg shadow-lg bg-black overflow-hidden">
                  <Image
                    src={`/images/${game.id}-cover.png`}
                    alt={`${game.title} Cover`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg opacity-90"
                  />
                  <div className="absolute bottom-4 left-0 right-0 z-10 flex flex-col items-center gap-2">
                    {game.playable ? (
                      <>
                        <button
                          onClick={() => router.push(`/${game.id}`)}
                          className="bg-white text-black text-sm px-3 py-1 rounded hover:opacity-80"
                        >
                          🕹️ Play Game
                        </button>
                        <button
                          onClick={() => router.push("/leaderboard")}
                          className="bg-purple-300 text-purple-900 text-sm px-3 py-1 rounded hover:bg-purple-400"
                        >
                          📊 Leaderboard
                        </button>
                      </>
                    ) : (
                      <div className="text-purple-200 italic text-sm">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-lg font-medium">{game.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Leaderboard */}
        <div className="w-full lg:w-1/3">
          <section className="max-w-md mx-auto lg:mx-0">
            <h2 className="text-2xl font-semibold text-center lg:text-left mb-4">
              Global Leaderboard
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-gray-400 px-3 py-2">Rank</th>
                  <th className="border-b border-gray-400 px-3 py-2">Name</th>
                  <th className="border-b border-gray-400 px-3 py-2 text-right">Bank ($)</th>
                  <th className="border-b border-gray-400 px-3 py-2 text-center">●</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((p, i) => (
                  <tr key={p.id} className={i % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : ""}>
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2 text-right">{p.bank_balance.toLocaleString()}</td>
                    <td className="px-3 py-2 text-center">{p.is_dead ? "💀" : "🟢"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className={`transition-all duration-300 fixed bottom-0 left-0 w-full bg-purple-100 dark:bg-purple-900 text-center text-sm p-4 shadow-md z-50 ${footerOpen ? "" : "translate-y-full"}`}>
        {footerOpen && (
          <div className="flex justify-between items-center px-4">
            <span className="text-purple-800 dark:text-purple-100">
              🍇 Like GrapeHub? Support the creator or share your ideas!
            </span>
            <div className="flex gap-2">
              <a
                href="https://buy.stripe.com/test_bIY4j6cQv2RA4Sk3cd"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm"
              >
                💰 Donate
              </a>
              <a
                href="mailto:mechatyronics@gmail.com"
                className="bg-purple-300 text-purple-900 px-3 py-1 rounded hover:bg-purple-400 text-sm"
              >
                💡 Suggest
              </a>
            </div>
          </div>
        )}
        <button
          onClick={() => setFooterOpen(!footerOpen)}
          className="absolute right-4 -top-4 bg-purple-400 text-white px-2 py-1 rounded-t shadow"
        >
          {footerOpen ? "▼" : "▲"}
        </button>
      </div>
    </div>
  );
}
