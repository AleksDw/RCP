import Navbar from "../Navbar";
import RoleGuard from "@/app/components/RoleGuard";
export default function EmployerDashboard() {
  return (
    <>
    <RoleGuard allowedRoles={['employer']}>
    <Navbar/>
    <div className="min-h-screen bg-blue-50 dark:bg-neutral-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Panel Pracodawcy
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
            <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">Obecni w pracy</h2>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">12 / 15</p>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
            <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400">Oczekujące wnioski</h2>
            <p className="text-3xl font-bold text-orange-500 dark:text-orange-400 mt-2">3</p>
          </div>
        </div>

        {/* Miejsce na tabelę pracowników */}
        <div className="mt-8 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800 p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Ostatnia aktywność zespołu</h2>
          <p className="text-gray-500 dark:text-gray-400">Tutaj wstawimy tabelę z godzinami logowania.</p>
        </div>
      </div>
    </div>
    </RoleGuard>
    </>
  );
}