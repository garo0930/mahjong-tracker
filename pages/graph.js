// pages/graph.js
import Navbar from "../components/Navbar";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import RequireAuth from "../components/RequireAuth";

export default function Graph() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const playerSnap = await getDocs(collection(db, "players"));
      const playerList = playerSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlayers(playerList);

      const gameSnap = await getDocs(collection(db, "games"));
      const gameList = gameSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGames(gameList.sort((a, b) => a.date.localeCompare(b.date)));
    };

    fetchData();
  }, []);

  // グラフ用データを整形
  const chartData = games.map((game) => {
    const entry = { date: game.date };
    players.forEach((p) => {
      const earning = game.earnings?.[p.id] ?? 0;
      entry[p.name] = earning;
    });
    return entry;
  });

  return (
    <RequireAuth>
    <div className="p-6">
    <Navbar />
      <h1 className="text-2xl font-bold mb-4">📈 収支推移グラフ</h1>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {players.map((p) => (
            <Line
              key={p.id}
              type="monotone"
              dataKey={p.name}
              strokeWidth={2}
              dot={true}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>  
    </RequireAuth>
  );
}
