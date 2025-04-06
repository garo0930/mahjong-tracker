// components/Navbar.js
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-4 py-3 mb-6">
      <div className="flex flex-wrap items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="text-xl font-bold text-blue-600">
          🀄 麻雀収支
        </Link>
        <div className="flex flex-wrap gap-4 text-sm sm:text-base">
          <Link href="/players" className="text-gray-700 hover:underline">プレイヤー</Link>
          <Link href="/games" className="text-gray-700 hover:underline">対局</Link>
          <Link href="/stats" className="text-gray-700 hover:underline">統計</Link>
          <Link href="/graph" className="text-gray-700 hover:underline">グラフ</Link>
          <Link href="/group-status" className="text-gray-700 hover:underline">グループ</Link>
        </div>
      </div>
    </nav>
  );
}
