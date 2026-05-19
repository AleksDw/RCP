"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/apiService";

// Interfejsy
interface TimeEntry {
  id: number;
  start_time: string;
  end_time: string | null;
  machine: number;
  amount_of_elements: number;
  element?: number;

  // NEW
  user_name?: string;
  machine_name?: string;
  element_name?: string;

  expected_minutes?: number | null;
  actual_minutes?: number | null;
  efficiency?: number | null;
}

interface MachineType {
  id: number;
  type_name: string;
}

interface Machine {
  id: number;
  machine_name: string;
  id_type: number;
}

interface Element {
  id: number;
  element_name: string;
  id_type: number;
  estimated_time_per_item: number;
}

export default function TimeEntryManager() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      // Pobieramy wpisy, typy maszyn, maszyny i elementy równolegle
      const [entriesData, typesData, machinesData, elementsData] = await Promise.all([
        apiService.get('/api/time-entries/'),
        apiService.get('/api/machine-types/'),
        apiService.get('/api/machines/'),
        apiService.get('/api/elements/')
      ]);
      setEntries(entriesData);
    } catch (err: any) {
      setError("Nie udało się pobrać danych z serwera.");
    } finally {
      setIsLoading(false);
    }
  };

  // Pomocnicza funkcja formatowania daty ze stringa
  const formatDate = (date: string) => {
  const d = new Date(date);

  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year = d.getUTCFullYear();

  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getEfficiencyColor = (value?: number | null) => {
  if (value === null || value === undefined) return "text-gray-400";

  if (value >= 100) return "text-green-500 font-bold";
  if (value >= 80) return "text-blue-500 font-semibold";
  if (value >= 50) return "text-yellow-500";
  return "text-red-500 font-semibold";
};

  return (
    <>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* TABELA WPISÓW */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Aktywność pracowników</h2>
        {isLoading ? (
          <p className="text-gray-500">Ładowanie wpisów...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-500">Brak zarejestrowanych wejść.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-3">Pracownik</th>
                  <th className="px-4 py-3">Maszyna</th>
                  <th className="px-4 py-3">Element</th>
                  <th className="px-4 py-3">Ilość</th>
                  <th className="px-4 py-3">Start</th>
                  <th className="px-4 py-3">Koniec</th>
                  <th className="px-4 py-3">Wydajność</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {entry.user_name}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {entry.machine_name}
                    </td>
                    <td className="px-4 py-3">
                      {entry.element ? entry.element_name : '-'}
                    </td>
                    <td className="px-4 py-3">{entry.amount_of_elements}</td>
                    <td className="px-4 py-3">{formatDate(entry.start_time)}</td>
                    <td className="px-4 py-3">{entry.end_time ? formatDate(entry.end_time) : '-'}</td>
                    <td className="px-4 py-3">
                      <span className={getEfficiencyColor(entry.efficiency)}>
                        {entry.efficiency !== null && entry.efficiency !== undefined
                          ? `${entry.efficiency.toFixed(1)}%`
                          : "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}