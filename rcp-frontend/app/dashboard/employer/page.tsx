import Navbar from "../Navbar";
import Link from "next/link";
import RoleGuard from "@/app/components/RoleGuard";

export default function EmployerDashboard() {
  return (
    <RoleGuard allowedRoles={['employer']}>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Panel Pracodawcy
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href="/dashboard/employer/user"
              className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-shadow group"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Pracownicy
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Zarządzaj pracownikami
              </p>
            </Link>
            
            <Link
              href="/dashboard/employer/statistics"
              className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-shadow group"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Statystyki
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Zarządzaj statystykami
              </p>
            </Link>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

