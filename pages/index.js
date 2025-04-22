// pages/index.js
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
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

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen p-6 ${themeClassMap[theme]} dark:text-white`}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">🀄 麻雀収支管理アプリ</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            プレイヤー・対局記録・統計・グループ管理まで全てここから！
          </p>

          <div className="grid gap-4">
            <Link href="/players" className="block bg-blue-500 text-white py-3 rounded shadow hover:bg-blue-600">
              👤 プレイヤー管理
            </Link>
            <Link href="/games" className="block bg-green-500 text-white py-3 rounded shadow hover:bg-green-600">
              🀄 対局記録
            </Link>
            <Link href="/stats" className="block bg-purple-500 text-white py-3 rounded shadow hover:bg-purple-600">
              📊 統計・分析
            </Link>
            <Link href="/graph" className="block bg-yellow-500 text-white py-3 rounded shadow hover:bg-yellow-600">
              📈 収支グラフ
            </Link>
            <Link href="/rank-graph" className="block bg-yellow-500 text-white py-3 rounded shadow hover:bg-yellow-600">
              📈 平均順位
            </Link>
            <Link href="/group" className="block bg-indigo-500 text-white py-3 rounded shadow hover:bg-indigo-600">
              ➕ グループ作成
            </Link>
            <Link href="/group-join" className="block bg-indigo-400 text-white py-3 rounded shadow hover:bg-indigo-500">
              🔑 グループに参加
            </Link>
            <Link href="/group-status" className="block bg-gray-600 text-white py-3 rounded shadow hover:bg-gray-700">
              📛 所属グループの確認
            </Link>
            <Link href="/login" className="block bg-gray-800 text-white py-3 rounded shadow hover:bg-gray-900">
              🔐 ログイン
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
