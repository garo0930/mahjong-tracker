// pages/login.js
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function LoginPage() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("wafu");

  const themeClassMap = {
    wafu: "bg-amber-50 text-gray-900",
    kinzoku: "bg-zinc-900 text-yellow-300",
    chuka: "bg-yellow-50 text-red-800",
  };

  useEffect(() => {
    const storedDark = localStorage.getItem("darkMode");
    const storedTheme = localStorage.getItem("theme");
    if (storedDark) setDarkMode(storedDark === "true");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("ログインに失敗しました");
      console.error(error);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${themeClassMap[theme]} dark:text-white`}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">🔐 ログインページ</h1>
          <Navbar />
          {user ? (
            <>
              <p className="mb-4">ようこそ、{user.displayName} さん！</p>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                ログアウト
              </button>
            </>
          ) : (
            <button
              onClick={login}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Googleでログイン
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
