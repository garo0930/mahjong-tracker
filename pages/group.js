// pages/group.js
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import RequireAuth from "../components/RequireAuth";

export default function Group() {
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");
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

  const handleCreate = async () => {
    if (!groupName) return;
    const docRef = await addDoc(collection(db, "groups"), {
      name: groupName,
    });
    const id = docRef.id;
    localStorage.setItem("groupId", id);
    setGroupId(id);
    setGroupName("");
  };

  return (
    <RequireAuth>
      <div className={darkMode ? "dark" : ""}>
        <div className={`p-4 min-h-screen ${themeClassMap[theme]} dark:text-white`}>
          <Navbar />
          <h1 className="text-2xl font-bold mb-4">グループ作成</h1>
          <div className="mb-4">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="グループ名"
              className="border px-2 py-1"
            />
            <button
              onClick={handleCreate}
              className="ml-2 bg-blue-600 text-white px-4 py-1 rounded"
            >
              作成
            </button>
          </div>
          {groupId && <p className="text-green-600">作成されたグループID：{groupId}</p>}
        </div>
      </div>
    </RequireAuth>
  );
}