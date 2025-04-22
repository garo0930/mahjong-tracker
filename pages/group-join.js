// pages/group-join.js
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import RequireAuth from "../components/RequireAuth";

export default function GroupJoin() {
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");
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

  const handleJoin = async () => {
    if (!groupId) return;
    const groupRef = doc(db, "groups", groupId);
    const snap = await getDoc(groupRef);
    if (snap.exists()) {
      localStorage.setItem("groupId", groupId);
      setMessage("グループに参加しました！");
    } else {
      setMessage("グループが見つかりません。");
    }
  };

  return (
    <RequireAuth>
      <div className={darkMode ? "dark" : ""}>
        <div className={`p-4 min-h-screen ${themeClassMap[theme]} dark:text-white`}>
          <Navbar />
          <h1 className="text-2xl font-bold mb-4">グループ参加</h1>
          <div className="mb-4">
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="グループIDを入力"
              className="border px-2 py-1"
            />
            <button
              onClick={handleJoin}
              className="ml-2 bg-blue-600 text-white px-4 py-1 rounded"
            >
              参加
            </button>
          </div>
          {message && <p className="text-green-600">{message}</p>}
        </div>
      </div>
    </RequireAuth>
  );
}
