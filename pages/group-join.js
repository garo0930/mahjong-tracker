// pages/group-join.js
import Navbar from "../components/Navbar";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function JoinGroupPage() {
  const [inputGroupId, setInputGroupId] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  // ✅ ログインユーザーを取得
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const checkGroup = async () => {
    if (!inputGroupId) {
      setMessage('グループIDを入力してください');
      return;
    }

    // ✅ Firestore でグループの存在チェック
    const q = query(
      collection(db, 'groups'),
      where('groupId', '==', inputGroupId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // ✅ ① localStorage に保存
      localStorage.setItem('groupId', inputGroupId);

      // ✅ ② Firestore の users コレクションに groupId を保存
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          groupId: inputGroupId
        });
      }

      // ✅ ③ /players に遷移
      router.push('/players');
    } else {
      setMessage('❌ グループIDが存在しません');
    }
  };

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">🧑‍🤝‍🧑 グループに参加</h1>

      <input
        type="text"
        value={inputGroupId}
        onChange={(e) => setInputGroupId(e.target.value)}
        className="border px-4 py-2 rounded w-full sm:w-64"
        placeholder="グループIDを入力"
      />
      <button
        onClick={checkGroup}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        グループに参加
      </button>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
