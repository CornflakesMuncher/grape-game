import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Hub() {
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(true);
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
    const storedName = localStorage.getItem("playerName");
    if (storedName) {
      setPlayerName(storedName);
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white px-6 py-4 transition-colors duration-300">
      {/* Top left player name */}
      <div className="absolute top-4 left-4 text-sm text-purple-500 dark:text-purple-300">
        Welcome, {playerName}
      </div>

      {/* Center title */}
      <div className="text-center mt-12">
        <h1 className="text-5xl font-extrabold text-purple-600 dark:text-purple-400">
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
            <div className="bg-green-700 w-56 h-80 rounded-lg shadow-lg flex flex-col justify-between p-4">
              {game.playable ? (
                <>
                  <div className="flex-grow" />
                  <div className="flex flex-col gap-2">
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
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-purple-200 italic text-sm">
                  Coming Soon
                </div>
              )}
            </div>

            {/* Game Title Below Cover */}
            <div className="mt-2 text-lg font-medium">{game.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
