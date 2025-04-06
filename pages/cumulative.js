// pages/cumulative.js
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

export default function CumulativeGraph() {
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

  // 累積収支の計算
  const cumulativeData = [];
  const totals = {}; // プレイヤーごとの合計収支

  games.forEach((game) => {
    const entry = { date: game.date };
    players.forEach((p) => {
      const gain = game.earnings?.[p.id] ?? 0;
      totals[p.name] = (totals[p.name] || 0) + gain;
      entry[p.name] = totals[p.name];
    });
    cumulativeData.push(entry);
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📈 累積収支グラフ</h1>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={cumulativeData}>
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
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
