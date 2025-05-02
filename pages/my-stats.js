import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import Navbar from "../components/Navbar";

export default function MyStats() {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const dummyGames = [
      { date: new Date('2025-04-20'), rank: 1, score: +30 },
      { date: new Date('2025-04-21'), rank: 2, score: +5 },
      { date: new Date('2025-04-21'), rank: 3, score: -10 },
      { date: new Date('2025-04-22'), rank: 4, score: -25 },
      { date: new Date('2025-04-23'), rank: 1, score: +40 },
    ];
    setGames(dummyGames);
    setFilteredGames(dummyGames);
  }, []);

  const captureAndDownload = () => {
    const target = document.getElementById("capture-area");
    html2canvas(target).then((canvas) => {
      const link = document.createElement("a");
      link.download = "performance_data.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  const handleFilter = () => {
    if (!startDate || !endDate) return;
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const filtered = games.filter(
      (game) => game.date >= sDate && game.date <= eDate
    );
    setFilteredGames(filtered);
  };

  const countByRank = (rank) => filteredGames.filter(g => g.rank === rank).length;
  const calcRate = (count) => {
    if (filteredGames.length === 0) return 0;
    return ((count / filteredGames.length) * 100).toFixed(2);
  };
  const calcRelayRate = () => {
    if (filteredGames.length === 0) return 0;
    return (((countByRank(1) + countByRank(2)) / filteredGames.length) * 100).toFixed(2);
  };
  const totalScore = filteredGames.reduce((sum, g) => sum + g.score, 0);
  const averageScore = filteredGames.length > 0 ? (totalScore / filteredGames.length).toFixed(1) : 0;
  const averageRank = filteredGames.length > 0
    ? ((countByRank(1) * 1 + countByRank(2) * 2 + countByRank(3) * 3 + countByRank(4) * 4) / filteredGames.length).toFixed(2)
    : 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />

      {/* 日付選択 */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-sm mb-1">開始日</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm mb-1">終了日</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <button
          onClick={handleFilter}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition self-end"
        >
          🎯 成績表示
        </button>
      </div>

      {/* 成績カード */}
      <div className="max-w-5xl mx-auto mt-4">
        <div
          id="capture-area"
          className="rounded-3xl p-8 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl border-4 border-yellow-300 dark:border-gray-300 text-center"
        >
          {/* タイトル */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold mb-2">📊 パフォーマンスデータ</h1>
            {startDate && endDate && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(startDate)} ～ {formatDate(endDate)}
              </p>
            )}
          </div>

          {/* 2列きっちりレイアウト */}
          <div className="grid grid-cols-2 gap-8 text-lg font-semibold">
            {/* 左列 */}
            <div className="flex flex-col items-end space-y-3">
              <div className="flex items-center gap-2">
                <span>🥇 一位率</span>
                <span className="text-yellow-600 dark:text-yellow-400">{calcRate(countByRank(1))}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🥈 二位率</span>
                <span className="text-yellow-600 dark:text-yellow-400">{calcRate(countByRank(2))}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🥉 三位率</span>
                <span className="text-yellow-600 dark:text-yellow-400">{calcRate(countByRank(3))}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💥 四位率</span>
                <span className="text-yellow-600 dark:text-yellow-400">{calcRate(countByRank(4))}%</span>
              </div>
            </div>

            {/* 右列 */}
            <div className="flex flex-col items-start space-y-3">
              <div className="flex items-center gap-2">
                <span>🀄 対局数</span>
                <span className="text-yellow-600 dark:text-yellow-400">{filteredGames.length}回</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📈 平均素点</span>
                <span className="text-yellow-600 dark:text-yellow-400">{averageScore}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🧮 平均順位</span>
                <span className="text-yellow-600 dark:text-yellow-400">{averageRank}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="text-center mt-6">
          <button
            onClick={captureAndDownload}
            className="px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition"
          >
            📷 画像保存
          </button>
        </div>
      </div>
    </div>
  );
}
