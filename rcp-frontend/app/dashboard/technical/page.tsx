import RoleGuard from "@/app/components/RoleGuard";
import Link from "next/link";
import Navbar from "../Navbar";

export default function TechnicalDashboard() {
  return (
    <RoleGuard allowedRoles={['technical']}>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Panel Technika
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/dashboard/technical/machine-types"
              className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-shadow group"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Typy maszyn
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Zarządzaj typami maszyn
              </p>
            </Link>

            <Link
              href="/dashboard/technical/machines"
              className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-shadow group"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Maszyny
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Zarządzaj maszynami
              </p>
            </Link>

            <Link
              href="/dashboard/technical/elements"
              className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-shadow group"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Elementy
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Zarządzaj elementami
              </p>
            </Link>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}