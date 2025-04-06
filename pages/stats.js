// pages/stats.js
import Navbar from "../components/Navbar";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import RequireAuth from "../components/RequireAuth";

export default function Stats() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const playerSnap = await getDocs(collection(db, "players"));
      const playerList = playerSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlayers(playerList);

      const gameSnap = await getDocs(collection(db, "games"));
      const gameList = gameSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGames(gameList);
    };

    fetchData();
  }, []);

  const getStats = (playerId) => {
    const playerGames = games.filter(game => game.rankings);
    let totalRank = 0;
    let totalGames = 0;
    let totalEarnings = 0;

    playerGames.forEach(game => {
      const ranking = game.rankings.find(r => r.playerId === playerId);
      const earning = game.earnings?.[playerId] ?? 0;
      if (ranking) {
        totalRank += ranking.rank;
        totalGames += 1;
        totalEarnings += earning;
      }
    });

    const averageRank = totalGames > 0 ? (totalRank / totalGames).toFixed(2) : "-";

    return {
      averageRank,
      totalEarnings,
      totalGames,
    };
  };

  
  return (
    <RequireAuth>
    <div className="p-6">
    <Navbar />
      <h1 className="text-2xl font-bold mb-4">📊 統計情報</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
  {players.map((player) => {
    const stats = getStats(player.id);
    return (
      <div
        key={player.id}
        className="bg-white rounded shadow p-4 text-sm sm:text-base"
      >
        <div className="font-bold text-lg mb-2">{player.name}</div>
        <div>📊 平均順位：<span className="font-medium">{stats.averageRank}</span></div>
        <div>💰 合計収支：<span className="font-medium">{stats.totalEarnings}円</span></div>
        <div>🀄 対局数：<span className="font-medium">{stats.totalGames}</span></div>
      </div>
    );
  })}
</div>
    </div>
    </RequireAuth>
  );
}
