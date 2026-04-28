"use client";

import { UserRole } from "../auth/RoleToggle";

interface DashboardViewProps {
  role: UserRole;
}

export default function DashboardView({ role }: DashboardViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* "Na początku strony" - Prosty pasek informacyjny */}
      <header className="bg-white border-b dark:bg-neutral-900 dark:border-neutral-800 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">RCP App</h1>
          <div className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-sm font-semibold">
            {role === "employee" ? "Jestem pracownikiem" : "Jestem pracodawcą"}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-md border dark:border-neutral-800">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            Witaj w panelu {role === "employee" ? "Pracownika" : "Pracodawcy"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            To jest Twoja strona główna po zalogowaniu. Tutaj pojawią się Twoje statystyki i zadania.
          </p>
        </div>
      </main>
    </div>
  );
}