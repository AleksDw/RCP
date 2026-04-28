"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem('user_name');
    if (storedName) setName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <nav className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">RCP System</div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Witaj, <span className="font-bold">{name}</span>
          </span>
          <button 
            onClick={handleLogout}
            className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 px-3 py-1 rounded text-gray-600 dark:text-gray-400 transition-colors"
          >
            Wyloguj
          </button>
        </div>
      </div>
    </nav>
  );
}