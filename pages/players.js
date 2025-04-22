// pages/players.js
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import RequireAuth from "../components/RequireAuth";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const [rate, setRate] = useState(300);
  const [groupId, setGroupId] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("groupId") || "" : ""
  );
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
    if (!groupId) return;
    const fetchPlayers = async () => {
      const snapshot = await getDocs(collection(db, "players"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.groupId === groupId);
      setPlayers(list);
    };
    fetchPlayers();
  }, [groupId]);

  const handleAdd = async () => {
    if (!name || !groupId) return;
    const newPlayer = { name, rate: Number(rate), groupId };
    await addDoc(collection(db, "players"), newPlayer);
    setName("");
    setRate(300);
    const snapshot = await getDocs(collection(db, "players"));
    const updated = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(p => p.groupId === groupId);
    setPlayers(updated);
  };

  const handleDelete = async (id) => {
    await deleteDoc(collection(db, "players").doc(id));
    const snapshot = await getDocs(collection(db, "players"));
    const updated = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(p => p.groupId === groupId);
    setPlayers(updated);
  };

  return (
    <RequireAuth>
      <div className={darkMode ? "dark" : ""}>
        <div className={`p-4 min-h-screen ${themeClassMap[theme]} dark:text-white`}>
          <Navbar />
          <h1 className="text-2xl font-bold mb-4">プレイヤー管理</h1>

          <input
            type="text"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            placeholder="グループID"
            className="border px-2 py-1 mb-4"
          />

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前"
              className="border px-2 py-1"
            />
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="レート"
              className="border px-2 py-1"
            />
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              追加
            </button>
          </div>

          <ul>
            {players.map((player) => (
              <li key={player.id} className="mb-2 border-b pb-1">
                {player.name}（レート: {player.rate}）
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RequireAuth>
  );
}
