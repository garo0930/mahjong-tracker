// pages/index.js
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("wafu");
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const storedDark = localStorage.getItem("darkMode");
    const storedTheme = localStorage.getItem("theme");
    if (storedDark) setDarkMode(storedDark === "true");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("theme", theme);
  }, [darkMode, theme]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleTheme = () => {
    const nextTheme = theme === "wafu" ? "kinzoku" : theme === "kinzoku" ? "chuka" : "wafu";
    setTheme(nextTheme);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat text-gray-900 dark:text-white"
        style={{ backgroundImage: "url('/back.png')" }}
      >
        <div className="min-h-screen px-4 py-8 bg-white/80 dark:bg-gray-900/80">
          <Navbar />

          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={toggleDarkMode}
              className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-sm"
            >
              {darkMode ? "🌞 明るく" : "🌙 暗く"}
            </button>
            <button
              onClick={toggleTheme}
              className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-sm"
            >
              🎨 テーマ変更
            </button>
            <button
              onClick={() => setShowInfo(true)}
              className="px-3 py-1 rounded bg-blue-300 dark:bg-blue-700 text-sm"
            >
              ℹ️ 使い方
            </button>
          </div>

          <div className="max-w-3xl mx-auto text-center mt-10">
            <img src="/bnaner.png" alt="麻雀対局管理バナー" className="mx-auto mb-8 w-full max-w-md" />
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
              <Link href="/players"><img src="/player.png" alt="プレイヤー管理" className="w-full hover:scale-105 transition" /></Link>
              <Link href="/games"><img src="/play.png" alt="対局記録" className="w-full hover:scale-105 transition" /></Link>
              <Link href="/analysis"><img src="/analysis.png" alt="統計・分析" className="w-full hover:scale-105 transition" /></Link>
              <Link href="/graph"><img src="/graph.png" alt="収支グラフ" className="w-full hover:scale-105 transition" /></Link>
              <Link href="/rank-graph"><img src="/rank.png" alt="平均順位" className="w-full hover:scale-105 transition" /></Link>
              <Link href="/group"><img src="/newgroup.png" alt="グループ作成" className="w-full hover:scale-105 transition" /></Link>
              <Link href="/group-join"><img src="/group.png" alt="グループに参加" className="w-full hover:scale-105 transition" /></Link>
              <Link href="/group-status"><img src="/confirmation.png" alt="所属グループの確認" className="w-full hover:scale-105 transition" /></Link>
              <Link href="/login"><img src="/login.png" alt="ログイン" className="w-full hover:scale-105 transition" /></Link>
            </div>
          </div>

          {showInfo && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full text-left shadow-xl">
                <h2 className="text-xl font-bold mb-2">ℹ️ アプリの使い方</h2>
                <ul className="list-disc pl-5 text-sm mb-3 space-y-1">
                  <li>👤 プレイヤーを登録して、対局に参加する人を管理</li>
                  <li>🀄 対局記録で点数を入力し、収支や順位を自動計算</li>
                  <li>📊 統計・分析で勝率や平均順位などを確認</li>
                  <li>📈 グラフでスコアや順位の推移を視覚的に表示</li>
                  <li>➕ グループを作成し、友達とデータを共有</li>
                </ul>
                <p className="text-sm mb-2">
                  🔐 <strong>なぜGoogleログインが必要？</strong><br />
                  あなた専用のデータを保存・管理するために、Googleログインによる本人確認を行います。<br />
                  メールアドレス等は公開されず、他の人とデータが混ざることはありません。
                </p>
                <div className="text-right">
                  <button onClick={() => setShowInfo(false)} className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
