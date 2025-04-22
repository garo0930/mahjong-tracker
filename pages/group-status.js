// pages/group-status.js
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import RequireAuth from "../components/RequireAuth";

export default function GroupStatus() {
  const [groupId, setGroupId] = useState(() => typeof window !== "undefined" ? localStorage.getItem("groupId") || "" : "");
  const [groupInfo, setGroupInfo] = useState(null);
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
    const fetchGroup = async () => {
      const groupRef = doc(db, "groups", groupId);
      const snap = await getDoc(groupRef);
      if (snap.exists()) {
        setGroupInfo(snap.data());
      }
    };
    fetchGroup();
  }, [groupId]);

  return (
    <RequireAuth>
      <div className={darkMode ? "dark" : ""}>
        <div className={`p-4 min-h-screen ${themeClassMap[theme]} dark:text-white`}>
          <Navbar />
          <h1 className="text-2xl font-bold mb-4">グループ情報</h1>
          {groupId && <p className="mb-2">現在のグループID: <strong>{groupId}</strong></p>}
          {groupInfo ? (
            <p>グループ名: {groupInfo.name}</p>
          ) : (
            <p className="text-red-500">グループ情報が見つかりません。</p>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
