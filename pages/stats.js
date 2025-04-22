// pages/stats.js
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import RequireAuth from "../components/RequireAuth";

export default function Stats() {
  const [players, setPlayers] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState([]);
  const [groupId, setGroupId] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("groupId") || "" : ""
  );
  const [sortedByTotal, setSortedByTotal] = useState([]);
  const [sortedByAvgRank, setSortedByAvgRank] = useState([]);
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
        .filter((g) => g.groupId === groupId);

      const filteredGames = games.filter((game) => {
        const gameDate = game.date || "";
        if (startDate && gameDate < startDate) return false;
        if (endDate && gameDate > endDate) return false;
        return true;
      });

      const totals = {};

      filteredGames.forEach((game) => {
        for (const pid in game.pointDiffs) {
          if (!totals[pid]) {
            totals[pid] = {
              ptSum: 0,
              sotenSum: 0,
              rankSum: 0,
              count: 0,
              winCount: 0,
              secondCount: 0,
              thirdCount: 0,
              lastCount: 0,
            };
          }

          const pt = game.pointDiffs[pid] ?? 0;
          const soten = game.scores?.[pid] ? (Number(game.scores[pid]) - 25000) / 1000 : 0;
          const playerRank = game.rankings?.find((r) => r.playerId === pid)?.rank || 0;

          if (playerRank === 1) totals[pid].winCount++;
          if (playerRank === 2) totals[pid].secondCount++;
          if (playerRank === 3) totals[pid].thirdCount++;
          if (playerRank === 4) totals[pid].lastCount++;

          totals[pid].ptSum += pt;
          totals[pid].sotenSum += soten;
          totals[pid].rankSum += playerRank;
          totals[pid].count++;
        }
      });

      const statsArray = Object.entries(totals).map(([pid, data]) => {
        const player = players.find((p) => p.id === pid);
        const avgPt = data.ptSum / data.count;
        const avgSoten = data.sotenSum / data.count;
        const total = avgPt + avgSoten;
        const winRate = data.count > 0 ? (data.winCount / data.count) * 100 : 0;
        const lastRate = data.count > 0 ? (data.lastCount / data.count) * 100 : 0;
        const secondRate = data.count > 0 ? (data.secondCount / data.count) * 100 : 0;
        const thirdRate = data.count > 0 ? (data.thirdCount / data.count) * 100 : 0;

        return {
          name: player?.name || "不明",
          avgPt: avgPt.toFixed(2),
          avgSoten: avgSoten.toFixed(2),
          avgRank: (data.rankSum / data.count).toFixed(2),
          total: total.toFixed(2),
          winRate: winRate.toFixed(1),
          secondRate: secondRate.toFixed(1),
          thirdRate: thirdRate.toFixed(1),
          lastRate: lastRate.toFixed(1),
        };
      });

      const sortedTotal = [...statsArray].sort((a, b) => b.total - a.total);
      const sortedRank = [...statsArray].sort((a, b) => a.avgRank - b.avgRank);

      setStats(statsArray);
      setSortedByTotal(sortedTotal);
      setSortedByAvgRank(sortedRank);
    };

    if (groupId) fetchData();
  }, [groupId, startDate, endDate]);

  return (
    <RequireAuth>
      <div className={darkMode ? "dark" : ""}>
        <div className={`p-4 min-h-screen ${themeClassMap[theme]} dark:text-white`}>
          <Navbar />
          <h1 className="text-2xl font-bold mb-4">統計（平均）</h1>

          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">開始日</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">終了日</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border px-2 py-1" />
            </div>
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                <th className="p-2">プレイヤー</th>
                <th className="p-2">平均順位</th>
                <th className="p-2">平均順位差 (pt)</th>
                <th className="p-2">平均素点</th>
                <th className="p-2">合計スコア</th>
                <th className="p-2">1位率</th>
                <th className="p-2">2位率</th>
                <th className="p-2">3位率</th>
                <th className="p-2">ラス率</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.avgRank}</td>
                  <td className="p-2">{s.avgPt}</td>
                  <td className="p-2">{s.avgSoten}</td>
                  <td className="p-2">{s.total}</td>
                  <td className="p-2">{s.winRate}%</td>
                  <td className="p-2">{s.secondRate}%</td>
                  <td className="p-2">{s.thirdRate}%</td>
                  <td className="p-2">{s.lastRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-bold mt-8 mb-2">🏆 合計スコア ランキング</h2>
          <ol className="list-decimal pl-6 mb-6">
            {sortedByTotal.map((s, i) => (
              <li key={i}>{s.name}（{s.total} pt）</li>
            ))}
          </ol>

          <h2 className="text-xl font-bold mt-8 mb-2">🥇 平均順位 ランキング</h2>
          <ol className="list-decimal pl-6">
            {sortedByAvgRank.map((s, i) => (
              <li key={i}>{s.name}（{s.avgRank} 位）</li>
            ))}
          </ol>
        </div>
      </div>
    </RequireAuth>
  );
}