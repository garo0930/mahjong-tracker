// pages/players.js
import Navbar from "../components/Navbar";
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

import RequireAuth from "../components/RequireAuth";

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [rate, setRate] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRate, setEditRate] = useState('');
  const [userId, setUserId] = useState(null);
  const handleDeletePlayer = async (id) => {
    await deleteDoc(doc(db, 'players', id));
    setPlayers(players.filter((p) => p.id !== id));
  };
  const [groupId, setGroupId] = useState(() => {
    // 初回だけ localStorage から groupId を読み取る
    return typeof window !== 'undefined'
      ? localStorage.getItem('groupId') || ''
      : '';
  });
  const handleSaveEdit = async (id) => {
    const playerRef = doc(db, 'players', id);
    await setDoc(playerRef, {
      name: editName,
      rate: Number(editRate)
    });
    setEditId(null);
  
    // 最新のデータを再取得
    const snapshot = await getDocs(collection(db, 'players'));
const playerList = snapshot.docs
  .map(doc => ({ id: doc.id, ...doc.data() }))
  .filter(player => player.groupId === groupId);// 🔽 userIdが一致するものだけ
setPlayers(playerList);

  };
  
  

  // データ取得
  useEffect(() => {
    if (!groupId) return; // 🔐 groupIdが空なら何もしない
  
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'players'));
      const playerList = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(player => player.groupId === groupId); // ← 絞り込み
      setPlayers(playerList);
    };
  
    fetchData();
  }, [groupId]); // ← groupId が変更されたときにだけ実行！
  

  // プレイヤー追加
  const handleAddPlayer = async () => {
    if (!name || !rate) return;

    const newPlayer = {
      name,
     rate: Number(rate),
     groupId: groupId // ← ここを追加！
    };
    
    const docRef = await addDoc(collection(db, 'players'), newPlayer);
    

    setPlayers([...players, { id: docRef.id, ...newPlayer }]);
    setName('');
    setRate('');
  };

  return (
    <RequireAuth>
    <div className="p-4">
    <Navbar />
      <h1 className="text-2xl font-bold mb-4">プレイヤー管理</h1>
 <div className="mb-4">
      <label className="block mb-1 font-semibold">グループID：</label>
      <input
        type="text"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
        className="border px-2 py-1 w-full sm:w-64"
        placeholder="例：group-abc123"
      />
    </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <input
          type="number"
          placeholder="レート"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={handleAddPlayer}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          追加
        </button>
      </div>

      <ul>
  {players.map((player) => (
    <li key={player.id} className="border p-2 my-1">
      {editId === player.id ? (
        <div>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="border px-2 py-1 mr-2"
          />
          <input
            type="number"
            value={editRate}
            onChange={(e) => setEditRate(e.target.value)}
            className="border px-2 py-1 mr-2"
          />
          <button onClick={() => handleSaveEdit(player.id)} className="bg-green-500 text-white px-2 py-1 mr-2 rounded">
            保存
          </button>
          <button onClick={() => setEditId(null)} className="text-gray-500">
            キャンセル
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
  <span>{player.name} - レート: {player.rate}</span>
  <div className="flex gap-2">
    <button
      onClick={() => {
        setEditId(player.id);
        setEditName(player.name);
        setEditRate(player.rate);
      }}
      className="text-blue-500"
    >
      編集
    </button>
    <button
      onClick={() => handleDeletePlayer(player.id)}
      className="text-red-500"
    >
      削除
    </button>
  </div>
</div>

      )}
    </li>
  ))}
</ul>

    </div>
    </RequireAuth>
  );
}
