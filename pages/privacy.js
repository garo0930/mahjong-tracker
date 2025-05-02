import Navbar from "../components/Navbar";

export default function Privacy() {
  return (
    <div className="min-h-screen px-6 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">プライバシーポリシー</h1>
        <p className="mb-4">本アプリでは、Googleログイン機能を利用して、ユーザーの氏名・メールアドレス等を取得します。</p>

        <h2 className="text-xl font-bold mt-6 mb-2">第1条（個人情報の取得）</h2>
        <p className="mb-4">Googleログインを通じて認証情報を取得します。</p>

        <h2 className="text-xl font-bold mt-6 mb-2">第2条（個人情報の利用目的）</h2>
        <p className="mb-4">取得した個人情報は、ユーザー管理およびアプリ機能提供のために使用されます。</p>

        <h2 className="text-xl font-bold mt-6 mb-2">第3条（個人情報の第三者提供）</h2>
        <p className="mb-4">法令に基づく場合を除き、第三者に提供することはありません。</p>

        <h2 className="text-xl font-bold mt-6 mb-2">第4条（安全管理）</h2>
        <p className="mb-4">個人情報は、漏洩・紛失のないよう適切に管理します。</p>

        <h2 className="text-xl font-bold mt-6 mb-2">第5条（ポリシーの変更）</h2>
        <p className="mb-4">本プライバシーポリシーは、必要に応じて改定する場合があります。</p>
      </div>
    </div>
  );
}
