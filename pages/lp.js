// pages/lp.js
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-amber-50 text-gray-900 min-h-screen font-sans">
      {/* ヒーローセクション */}
      <section className="text-center py-20 px-4 bg-gradient-to-b from-amber-100 to-amber-50">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">麻雀対局管理アプリ</h1>
        <p className="text-lg md:text-xl mb-6">成績・収支・順位を、もっとカンタンに・美しく管理。</p>
        <Link href="/login" className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
          今すぐはじめる
        </Link>
      </section>

      {/* 特徴紹介 */}
      <section className="py-16 px-4 max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-3xl mb-2">👥</div>
          <h2 className="text-xl font-bold mb-2">プレイヤー管理</h2>
          <p>友人やメンバーの名前・レートを自由に登録できます。</p>
        </div>
        <div>
          <div className="text-3xl mb-2">🀄</div>
          <h2 className="text-xl font-bold mb-2">対局記録</h2>
          <p>スコアや順位を入力すると、自動で収支や順位ポイントを計算。</p>
        </div>
        <div>
          <div className="text-3xl mb-2">📊</div>
          <h2 className="text-xl font-bold mb-2">統計グラフ</h2>
          <p>勝率・平均順位・素点推移などがグラフでひと目でわかります。</p>
        </div>
      </section>

      {/* スクリーンショットエリア */}
      <section className="py-16 px-4 bg-white text-center">
        <h2 className="text-2xl font-bold mb-6">アプリ画面プレビュー</h2>
        <div className="flex justify-center">
          <Image src="/top-sample.png" alt="TOP画面" width={800} height={400} className="rounded shadow-lg" />
        </div>
      </section>

      {/* フッター */}
      <footer className="py-6 text-center text-sm text-gray-600">
        <Link href="/terms" className="underline mr-4">利用規約</Link>
        <Link href="/privacy" className="underline">プライバシーポリシー</Link>
      </footer>
    </div>
  );
}
