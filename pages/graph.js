// pages/graph.js
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";
import RequireAuth from "../components/RequireAuth";

export default function Graph() {
  const [dataByPlayer, setDataByPlayer] = useState({});
  const [groupId, setGroupId] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("groupId") || "" : ""
  );

  const [playerMap, setPlayerMap] = useState({}); // ← ここに移動！！
  const [displayMode, setDisplayMode] = useState("total"); // "total", "soten", "pt"



  useEffect(() => {
    const fetchData = async () => {
      const playerSnap = await getDocs(collection(db, "players"));
      const gameSnap = await getDocs(collection(db, "games"));
  
      const players = playerSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((p) => p.groupId === groupId);
      setPlayerMap(Object.fromEntries(players.map(p => [p.id, p.name]))); // ✅ 実名マップ
      // ↑ setPlayerMap() ここで実行！
  
      const games = gameSnap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((g) => g.groupId === groupId)
        .sort((a, b) => (a.date > b.date ? 1 : -1)); // 日付順
  
      const playerData = {};
      players.forEach((p) => {
        playerData[p.id] = [];
      });
  
      const playerSums = {}; // ← 累計用

      games.forEach((game) => {
        for (const pid in game.pointDiffs) {
          const soten =
            game.scores?.[pid] ? (Number(game.scores[pid]) - 25000) / 1000 : 0;
          const pt = game.pointDiffs[pid] ?? 0;
      
          // ✅ ここで累計スコアを計算
          if (!playerSums[pid]) playerSums[pid] = 0;
      
          let value = 0;
          if (displayMode === "soten") {
            value = soten;
          } else if (displayMode === "pt") {
            value = pt;
          } else if (displayMode === "total") {
            value = pt + soten;
          } else if (displayMode === "soten-cum") {
            playerSums[pid] += soten;
            value = playerSums[pid];
          } else if (displayMode === "pt-cum") {
            playerSums[pid] += pt;
            value = playerSums[pid];
          } else if (displayMode === "total-cum") {
            playerSums[pid] += pt + soten;
            value = playerSums[pid];
          }
      
          const entry = {
            date: game.date,
            value,
          };
      
          if (playerData[pid]) {
            playerData[pid].push(entry);
          }
        }
      });
      
  
      setDataByPlayer(playerData);
    };
  
    if (groupId) fetchData();
  },[groupId, displayMode]);
    
  return (
    <RequireAuth>
      <div className="p-4">
        <Navbar />
        <div className="flex gap-2 mb-4 flex-wrap">
  {[
    ["total", "合計スコア"],
    ["soten", "素点のみ"],
    ["pt", "順位差のみ"],
    ["total-cum", "累計合計"],
    ["soten-cum", "累計素点"],
    ["pt-cum", "累計順位差"]
  ].map(([mode, label]) => (
    <button
      key={mode}
      onClick={() => setDisplayMode(mode)}
      className={`px-3 py-1 rounded ${
        displayMode === mode ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      {label}
    </button>
  ))}
</div>


        <h1 className="text-2xl font-bold mb-4">スコア推移グラフ</h1>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.entries(dataByPlayer).map(([pid, data], index) => {
  const colors = [
    "#8884d8", // 青
    "#82ca9d", // 緑
    "#ff7300", // オレンジ
    "#d84d8a", // ピンク
    "#00c49f", // エメラルド
    "#ff6384", // 赤
    "#8dd1e1", // 水色
  ];
  const color = colors[index % colors.length]; // プレイヤー数に応じて色を循環

  return (
    <Line
      key={pid}
      type="monotone"
      dataKey="value"
      data={data}
      name={playerMap[pid] || "不明なプレイヤー"}
      stroke={color} // ✅ ここで色を指定！
      strokeWidth={2}
      dot={false}
    />
  );
})}

          </LineChart>
        </ResponsiveContainer>
      </div>
    </RequireAuth>
  );
}
