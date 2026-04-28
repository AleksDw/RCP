import Navbar from "../Navbar";
export default function EmployeeDashboard() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Panel Pracownika
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Przykładowa karta akcji */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">Rejestracja czasu</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Odbij się w pracy</p>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Rozpocznij pracę
            </button>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
            <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">Moje statystyki</h2>
            <p className="text-gray-500 dark:text-gray-400">Przepracowane godziny w tym miesiącu: <strong>120h</strong></p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}