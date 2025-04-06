// pages/group-status.js
import Navbar from "../components/Navbar";

import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function GroupStatusPage() {
  const [groupId, setGroupId] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setGroupId(data.groupId || '');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="p-4">読み込み中...</p>;

  return (
    <div className="p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">📛 所属グループの確認</h1>

      {user ? (
        <div className="text-lg">
          <p>ユーザー名：{user.displayName}</p>
          <p className="mt-2">
            所属グループID：<span className="font-mono text-green-600">{groupId || '未登録'}</span>
          </p>
        </div>
      ) : (
        <p>ログインしていません。</p>
      )}
    </div>
  );
}
