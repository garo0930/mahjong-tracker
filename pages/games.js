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
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [rateValue, setRateValue] = useState(300);
  const [userId, setUserId] = useState(null);
  const [groupId, setGroupId] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('groupId') || '' : '');
  const [manuallyEdited, setManuallyEdited] = useState(new Set());
  const [umaType, setUmaType] = useState("none");
  const [okaEnabled, setOkaEnabled] = useState(false);
  const [autoFilledId, setAutoFilledId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("wafu");

  const themeClassMap = {
    wafu: "bg-amber-50 text-gray-900",
    kinzoku: "bg-zinc-900 text-yellow-300",
    chuka: "bg-yellow-50 text-red-800",
  };

  const cardClassMap = {
    wafu: "bg-white border-[3px] border-red-400 rounded-xl shadow-md",
    kinzoku: "bg-zinc-800 border-[2px] border-yellow-300 rounded-lg shadow-md",
    chuka: "bg-white border-double border-[4px] border-red-600 rounded-lg shadow-inner",
  };

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) setDarkMode(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const totalPoints = 25000 * 4;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!groupId) return;
    const fetchPlayers = async () => {
      const snapshot = await getDocs(collection(db, 'players'));
      const playerList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(player => player.groupId === groupId);
      setPlayers(playerList);
    };
    const fetchGames = async () => {
      const snapshot = await getDocs(collection(db, 'games'));
      const gameList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(game => game.groupId === groupId);
      setGames(gameList);
    };
    fetchPlayers();
    fetchGames();
  }, [groupId]);

  const handleScoreChange = (playerId, value) => {
    const updated = { ...scores, [playerId]: value };
    const numericEntries = Object.entries(updated).filter(([_, val]) => val !== '' && !isNaN(Number(val)));
    const filledTotal = numericEntries.reduce((sum, [_, val]) => sum + Number(val), 0);
    const unfilledPlayers = players.filter(p => updated[p.id] === undefined || updated[p.id] === '' || isNaN(Number(updated[p.id])));

    if (players.length === 4) {
      if (unfilledPlayers.length === 1) {
        const remaining = unfilledPlayers[0];
        const autoScore = totalPoints - filledTotal;
        updated[remaining.id] = autoScore;
        setAutoFilledId(remaining.id);
      } else if (unfilledPlayers.length === 0 && autoFilledId) {
        const otherTotal = players.filter(p => p.id !== autoFilledId).reduce((sum, p) => sum + Number(updated[p.id] || 0), 0);
        updated[autoFilledId] = totalPoints - otherTotal;
      }
    }
    setScores(updated);
  };

  const handleAddGame = async () => {
    if (!date) return;

    const calculateRankingsAndPointDiffs = () => {
      const scoreEntries = Object.entries(scores).map(([pid, val]) => ({ playerId: pid, score: Number(val) }));
      const rankings = [...scoreEntries].sort((a, b) => b.score - a.score).map((entry, index) => ({ ...entry, rank: index + 1 }));

      const pointDiffs = {};
      rankings.forEach((entry) => {
        const diff = 2.5 - entry.rank;
        pointDiffs[entry.playerId] = diff;
      });

      const umaValues = {
        none: [0, 0, 0, 0],
        "5-10": [10000, 5000, -5000, -10000],
        "10-20": [20000, 10000, -10000, -20000],
        "10-30": [30000, 10000, -10000, -30000],
        "20-30": [30000, 20000, -20000, -30000],
      };
      const uma = umaValues[umaType] || [0, 0, 0, 0];

      const rawOkaMap = {};
      let totalOka = 0;
      const topPid = rankings[0].playerId;

      rankings.forEach((entry) => {
        const pid = entry.playerId;
        const score = entry.score;
        if (okaEnabled && pid !== topPid) {
          const diff = (score - 30000) / 1000;
          const rounded = Math.round(diff * 10) / 10;
          rawOkaMap[pid] = rounded;
          totalOka += rounded;
        }
      });

      if (okaEnabled) {
        rawOkaMap[topPid] = -totalOka;
      }

      const earnings = {};
      rankings.forEach((entry) => {
        const pid = entry.playerId;
        const score = entry.score;
        const soten = (score - 25000) / 1000;
        const umaScore = uma[entry.rank - 1] || 0;
        const oka = rawOkaMap[pid] ?? 0;
        earnings[pid] = {
          soten: Number(soten.toFixed(1)),
          uma: umaScore,
          oka,
          total: Math.round(soten * 1000 + umaScore + oka),
        };
      });

      return { rankings, pointDiffs, earnings };
    };

    const { rankings, pointDiffs, earnings } = calculateRankingsAndPointDiffs();
    const newGame = { date, scores, rankings, pointDiffs, earnings, groupId, umaType, oka: okaEnabled };
    const docRef = await addDoc(collection(db, 'games'), newGame);
    setGames([...games, { id: docRef.id, ...newGame }]);
    setScores({});
  };

  return (
    <RequireAuth>
      <div className={darkMode ? 'dark' : ''}>
        <div className={`p-4 min-h-screen ${themeClassMap[theme]} dark:text-white`}>
          <Navbar />

          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h1 className="text-2xl font-bold">ゲーム履歴記録</h1>
            <div className="flex gap-2 items-center">
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="border px-2 py-1">
                <option value="wafu">和風</option>
                <option value="kinzoku">金属</option>
                <option value="chuka">中華</option>
              </select>
              <button onClick={toggleDarkMode} className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white">
                {darkMode ? '🌞 明るく' : '🌙 暗く'}
              </button>
            </div>
          </div>

          <input type="text" value={groupId} onChange={(e) => setGroupId(e.target.value)} className="border px-2 py-1 w-full sm:w-64 mb-4" placeholder="例：group-abc123" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border px-2 py-1 mb-4" />

          <div className="grid gap-2 mb-4">
            {players.map((player) => (
              <div key={player.id} className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="w-full sm:w-32 font-mono">{player.name}</span>
                <input type="number" placeholder="点数" value={scores[player.id] ?? 25000} onChange={(e) => handleScoreChange(player.id, e.target.value)} step={100} className="border px-2 py-1 w-full sm:w-auto" />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">ウマ</label>
            <select value={umaType} onChange={(e) => setUmaType(e.target.value)} className="border px-2 py-1">
              <option value="none">なし</option>
              <option value="5-10">5-10（ゴットー）</option>
              <option value="10-20">10-20（ワンツー）</option>
              <option value="10-30">10-30（ワンスリー）</option>
              <option value="20-30">20-30（ツースリー）</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="mr-2" checked={okaEnabled} onChange={(e) => setOkaEnabled(e.target.checked)} />
              オカ（30000点返し）を適用
            </label>
          </div>

          <button onClick={handleAddGame} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow">
            保存
          </button>

          <h2 className="text-xl font-bold mt-6 mb-2">履歴</h2>
          <ul>
            {[...games].sort((a, b) => b.date.localeCompare(a.date)).map((game) => (
              <li key={game.id} className={`mb-4 p-4 ${cardClassMap[theme]}`}>
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedId(expandedId === game.id ? null : game.id)}>
                  <span className="font-semibold">🀄 {game.date}</span>
                  <span>{expandedId === game.id ? '▲' : '▼'}</span>
                </div>

                {expandedId === game.id && (
                  <ul className="ml-4 mt-2">
                    {Object.entries(game.scores).map(([pid, score]) => {
                      const player = players.find(p => p.id === pid);
                      const rank = game.rankings?.find(r => r.playerId === pid)?.rank || '-';
                      const earning = game.earnings?.[pid] ?? {};
                      const soten = earning.soten ?? ((Number(score) - 25000) / 1000).toFixed(1);
                      const uma = earning.uma ?? 0;
                      const oka = earning.oka ?? 0;
                      const totalPt = (Number(soten) + uma / 1000 + oka).toFixed(1);
                      return (
                        <li key={pid} className="text-sm">
                          <span className="font-bold">{rank === 1 ? '👑 ' : ''}{player?.name || '不明'}</span>：{score}点 ／ 順位：{rank} <br />
                          ┗ 素点：{soten} pt ／ ウマ：{(uma / 1000).toFixed(1)} pt ／ オカ：{oka.toFixed(1)} pt → 合計：{totalPt} pt
                        </li>
                      );
                    })}
                  </ul>
                )}

                <button onClick={() => handleDeleteGame(game.id)} className="mt-2 text-sm text-red-500">削除</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RequireAuth>
  );
}
