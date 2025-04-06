// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">🀄 麻雀収支管理アプリ</h1>
        <p className="text-gray-600 mb-8">
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
          <Link href="/cumulative" className="block bg-pink-500 text-white py-3 rounded shadow hover:bg-pink-600">
            📈 累積収支
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
  );
}
