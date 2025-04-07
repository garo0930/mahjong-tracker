// pages/group.js



import Navbar from "../components/Navbar";

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function GroupPage() {
  const [groupId, setGroupId] = useState('');
  const [user, setUser] = useState(null);
  

  // ログイン状態の取得
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser && !user) setUser(currentUser);
  });

  const createGroup = async () => {
    const newGroupId = uuidv4().slice(0, 8); // ランダムな短いID
    setGroupId(newGroupId);

    await addDoc(collection(db, 'groups'), {
      groupId: newGroupId,
      createdBy: user?.uid || 'unknown',
      createdAt: new Date()
    });

    alert(`グループを作成しました！ID: ${newGroupId}`);
  };

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">🧑‍🤝‍🧑 グループ作成</h1>
      <button
        onClick={createGroup}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        グループを作成する
      </button>

      {groupId && (
  <div className="mt-4">
    <p className="text-lg">あなたのグループID:</p>
    <div className="flex items-center gap-2 mt-1">
      <p className="font-mono text-xl text-green-600">{groupId}</p>
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(groupId);
          alert("グループIDをコピーしました！");
        }}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        コピー
      </button>
    </div>
    <p className="text-sm text-gray-500 mt-2">
      このIDを知り合いに共有してください
    </p>
  </div>
)}

    </div>
  );
}
