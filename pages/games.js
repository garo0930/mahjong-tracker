// pages/games.js
import Navbar from "../components/Navbar";

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

import RequireAuth from "../components/RequireAuth";

export default function Games() {
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [scores, setScores] = useState({});
  const [date, setDate] = useState('');
  const [rateValue, setRateValue] = useState(300); // 1レート = 300円
  const [userId, setUserId] = useState(null);
  const [groupId, setGroupId] = useState(() => {
    // 初回だけ localStorage から groupId を読み取る
    return typeof window !== 'undefined'
      ? localStorage.getItem('groupId') || ''
      : '';
  });
  const handleDeleteGame = async (id) => {
    await deleteDoc(doc(db, 'games', id));
  
    const snapshot = await getDocs(collection(db, 'games'));
    const gameList = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(game => game.groupId === groupId);
    setGames(gameList);
  };
// ログインユーザー取得
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserId(user.uid);
    }
  });
  return () => unsubscribe();
}, []);

// プレイヤー＆ゲーム取得
useEffect(() => {
  if (!groupId) return;

  const fetchPlayers = async () => {
    const snapshot = await getDocs(collection(db, 'players'));
    const playerList = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(player => player.groupId === groupId);
    setPlayers(playerList);
  };

  const fetchGames = async () => {
    const snapshot = await getDocs(collection(db, 'games'));
    const gameList = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(game => game.groupId === groupId);
    setGames(gameList);
  };

  fetchPlayers();
  fetchGames();
}, [groupId]);


  const handleScoreChange = (playerId, value) => {
    setScores(prev => ({
      ...prev,
      [playerId]: value
    }));
  };

  const calculateRankingsAndPointDiffs = () => {
    const scoreEntries = Object.entries(scores).map(([pid, val]) => ({
      playerId: pid,
      score: Number(val)
    }));
  
    const rankings = [...scoreEntries]
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));
  
    // ✅ 平均ではなく、基準値（中央値）を固定
    const baseScore = 2.5; // 1位との差が常に3ptになるように
  
    const pointDiffs = {};
    rankings.forEach((entry) => {
      const diff = baseScore - entry.rank;
      pointDiffs[entry.playerId] = diff;
    });
  
    return { rankings, pointDiffs };
  };
  
  

  const handleAddGame = async () => {
    if (!date) return;
  
    // ✅ 順位と順位差を計算
    const { rankings, pointDiffs } = calculateRankingsAndPointDiffs();
  
    // ✅ Firebase に保存するゲームデータ
    const newGame = {
      date,
      scores,
      rankings,
      pointDiffs, // ← これでOK！
      groupId: groupId,
    };
  
    const docRef = await addDoc(collection(db, 'games'), newGame);
    setGames([...games, { id: docRef.id, ...newGame }]);
    setDate('');
    setScores({});
  };
  

  return (
    <RequireAuth>
    <div className="p-4">
    <Navbar />
      <h1 className="text-2xl font-bold mb-4">ゲーム履歴記録</h1>
      <div className="mb-4">
  <label className="block mb-1 font-semibold">グループID：</label>
  <input
    type="text"
    value={groupId}
    onChange={(e) => setGroupId(e.target.value)}
    className="border px-2 py-1 w-full sm:w-64"
    placeholder="例：group-abc123"
  />
</div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="border px-2 py-1 w-full sm:w-auto"
  />
</div>

<div className="grid gap-2 mb-4">
  {players.map((player) => (
    <div key={player.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
      <span className="w-full sm:w-32">{player.name}</span>
      <input
  type="number"
  placeholder="点数"
  value={scores[player.id] ?? 25000} // ← 初期値 25000
  onChange={(e) => handleScoreChange(player.id, e.target.value)}
  step={100} // ← 矢印の単位を100点に
  className="border px-2 py-1 w-full sm:w-auto"
/>

    </div>
  ))}
</div>

<button
  onClick={handleAddGame}
  className="bg-green-500 text-white px-4 py-1 rounded"
>
  保存
</button>

      <h2 className="text-xl font-bold mt-6 mb-2">履歴</h2>
      <ul>
        {games.map((game) => (
          <li key={game.id} className="mb-4 p-3 bg-white shadow rounded">
          <div className="flex justify-between items-center">
            <span>🗓 {game.date}</span>
            <button
              onClick={() => handleDeleteGame(game.id)}
              className="text-red-500"
            >
              削除
            </button>
          </div>
        
          <ul className="ml-4 mt-2">
  {Object.entries(game.scores).map(([pid, score]) => {
    const player = players.find(p => p.id === pid);
    const rank = game.rankings?.find(r => r.playerId === pid)?.rank || '-';
    const pt = game.pointDiffs?.[pid] ?? 0;
    const baseScore = 25000; // ← 固定スタート点
    const rawScore = Number(score);
    const soten = ((rawScore - baseScore) / 1000).toFixed(1); // ← 素点計算

    return (
      <li key={pid} className="text-sm">
        {player?.name || '不明'}：{score}点 ／ 順位：{rank} ／ 順位差：{pt} pt ／ 素点：{soten}
      </li>
    );
  })}
</ul>

        </li>
        ))}
      </ul>
    </div>
    </RequireAuth>
  );
}
