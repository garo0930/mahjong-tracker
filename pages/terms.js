import Navbar from "../components/Navbar";

export default function Terms() {
  return (
    <div className="min-h-screen px-6 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">利用規約</h1>
        <p className="mb-4">この利用規約（以下、「本規約」といいます。）は、麻雀対局管理アプリ（以下、「本アプリ」といいます。）の利用条件を定めるものです。ユーザーは本規約に同意した上で本アプリを利用するものとします。</p>
        
        <h2 className="text-xl font-bold mt-6 mb-2">第1条（適用）</h2>
        <p className="mb-4">本規約は、本アプリの利用に関する一切の関係に適用されます。</p>

        <h2 className="text-xl font-bold mt-6 mb-2">第2条（禁止事項）</h2>
        <p className="mb-4">ユーザーは、以下の行為を行ってはなりません。<br />
        - 他人の個人情報を無断で登録・使用する行為<br />
        - 本アプリの運営を妨害する行為<br />
        - 法令または公序良俗に違反する行為<br />
        - 不正アクセスや第三者になりすます行為<br />
        - サーバーに過度な負担を与える行為
        </p>

        <h2 className="text-xl font-bold mt-6 mb-2">第3条（免責事項）</h2>
        <p className="mb-4">本アプリの利用によって生じた一切の損害について、運営者は責任を負いません。また、本アプリの仕様変更、中断、終了により発生した損害についても同様とします。</p>

        <h2 className="text-xl font-bold mt-6 mb-2">第4条（サービス内容の変更）</h2>
        <p className="mb-4">運営者は、ユーザーへの事前通知なしに、本アプリの内容を変更または停止することができます。</p>

        <h2 className="text-xl font-bold mt-6 mb-2">第5条（規約変更）</h2>
        <p className="mb-4">運営者は、本規約をいつでも変更することができ、変更後も本アプリを利用する場合は、変更後の規約に同意したものとみなします。</p>
      </div>
    </div>
  );
}
