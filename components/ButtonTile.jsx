import { useRouter } from "next/router";

export default function ButtonTile({ children, href }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className="w-40 h-16 sm:w-48 sm:h-20 flex items-center justify-center bg-amber-50 text-gray-900 border-4 border-gray-700 rounded-lg shadow-md font-bold text-lg cursor-pointer hover:brightness-95 transition"
    >
      {children}
    </div>
  );
}
