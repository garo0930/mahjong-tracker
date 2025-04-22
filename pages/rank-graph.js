// pages/rank-graph.js
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import RequireAuth from "../components/RequireAuth";

export default function RankGraph() {
  const [groupId, setGroupId] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("groupId") || "" : ""
  );
  const [players, setPlayers] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("wafu");

  const themeClassMap = {
    wafu: "bg-amber-50 text-gray-900",
    kinzoku: "bg-zinc-900 text-yellow-300",
    chuka: "bg-yellow-50 text-red-800",
  };

  useEffect(() => {
    const storedDark = localStorage.getItem("darkMode");
    const storedTheme = localStorage.getItem("theme");
    if (storedDark) setDarkMode(storedDark === "true");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const playerSnap = await getDocs(collection(db, "players"));
      const gameSnap = await getDocs(collection(db, "games"));

      const players = playerSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((p) => p.groupId === groupId);
      setPlayers(players);

      const games = gameSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((g) => g.groupId === groupId)
        .sort((a, b) => (a.date > b.date ? 1 : -1));

      const playerData = {};
      players.forEach((p) => {
        playerData[p.id] = [];
      });

      games.forEach((game) => {
        game.rankings?.forEach((entry) => {
          const { playerId, rank } = entry;
          if (playerData[playerId]) {
            playerData[playerId].push({
              date: game.date,
              rank,
            });
          }
        });
      });

      setGraphData(playerData);
    };

    if (groupId) fetchData();
  }, [groupId]);

  const playerMap = Object.fromEntries(players.map((p) => [p.id, p.name]));

  return (
    <RequireAuth>
      <div className={darkMode ? "dark" : ""}>
        <div className={`p-4 min-h-screen ${themeClassMap[theme]} dark:text-white`}>
          <Navbar />
          <h1 className="text-2xl font-bold mb-4">平均順位推移グラフ</h1>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart>
              <XAxis dataKey="date" />
              <YAxis reversed={true} domain={[1, 4]} tickCount={4} />
              <Tooltip />
              <Legend />
              {Object.entries(graphData).map(([pid, data], index) => {
                const colors = ["#8884d8", "#82ca9d", "#ff7300", "#d84d8a"];
                const color = colors[index % colors.length];
                return (
                  <Line
                    key={pid}
                    type="monotone"
                    dataKey="rank"
                    data={data}
                    name={playerMap[pid] || "不明"}
                    stroke={color}
                    strokeWidth={2}
                    dot={true}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </RequireAuth>
  );
}
