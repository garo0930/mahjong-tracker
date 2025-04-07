import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function GroupStatus() {
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("groupId") || "";
    setGroupId(saved);
  }, []);

  const handleCopy = async () => {
    if (!groupId) return;
    try {
      await navigator.clipboard.writeText(groupId);
      alert("グループIDをコピーしました！");
    } catch (err) {
      alert("コピーに失敗しました");
    }
  };

  return (
    <div className="p-4">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">所属グループの確認</h1>

      <div className="bg-gray-100 p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">現在のグループID</h2>
        <div className="flex items-center gap-2">
          <span className="font-mono text-blue-600">{groupId}</span>
          <button
            onClick={handleCopy}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            コピー
          </button>
        </div>
      </div>

      {/* ここに他のグループ情報や機能を追加してもOK！ */}
    </div>
  );
}
