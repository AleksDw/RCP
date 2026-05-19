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
  element?: number; // Add element field if it exists in your backend
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
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [allMachines, setAllMachines] = useState<Machine[]>([]);
  const [allElements, setAllElements] = useState<Element[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Stan formularza
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [machineId, setMachineId] = useState<string>("");
  const [selectedElementId, setSelectedElementId] = useState<string>("");
  const [amount, setAmount] = useState<string>("1");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

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
      setMachineTypes(typesData);
      setAllMachines(machinesData);
      setAllElements(elementsData);
    } catch (err: any) {
      setError("Nie udało się pobrać danych z serwera.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrowanie maszyn na podstawie wybranego typu
  const filteredMachines = allMachines.filter(m => m.id_type === parseInt(selectedTypeId));
  
  // Filtrowanie elementów na podstawie wybranego typu maszyny
  const filteredElements = allElements.filter(e => e.id_type === parseInt(selectedTypeId));

  // Aktualizuj szacowany czas gdy wybrany element lub ilość się zmieni
  useEffect(() => {
    if (selectedElementId && amount) {
      const selectedElement = allElements.find(e => e.id === parseInt(selectedElementId));
      if (selectedElement) {
        setEstimatedTime(selectedElement.estimated_time_per_item * parseInt(amount || "0"));
      }
    } else {
      setEstimatedTime(0);
    }
  }, [selectedElementId, amount, allElements]);

  // --- DODAWANIE (POST) ---
  const handleAddEntry = async () => {
    if (!machineId || !startTime) {
      alert("Proszę wybrać maszynę i czas rozpoczęcia.");
      return;
    }
    if (!selectedElementId) {
      alert("Proszę wybrać element.");
      return;
    }
    try {
      const newEntry = await apiService.post('/api/time-entries/', {
        machine: parseInt(machineId),
        element: parseInt(selectedElementId), // Dodajemy element
        amount_of_elements: parseInt(amount),
        start_time: startTime,
        end_time: endTime || null
      });
      setEntries([newEntry, ...entries]);
      resetForm();
      alert("Wpis dodany pomyślnie!");
    } catch (err: any) {
      alert("Błąd: " + err.message);
    }
  };

  // --- ZAPISYWANIE ZMIAN (PATCH) ---
  const handleSaveChanges = async () => {
    if (!editingId) return;
    if (!selectedElementId) {
      alert("Proszę wybrać element.");
      return;
    }
    try {
      const updatedEntry = await apiService.patch(`/api/time-entries/${editingId}/`, {
        machine: parseInt(machineId),
        element: parseInt(selectedElementId), // Dodajemy element
        amount_of_elements: parseInt(amount),
        start_time: startTime,
        end_time: endTime || null
      });
      setEntries(entries.map(e => e.id === editingId ? updatedEntry : e));
      resetForm();
      alert("Zmiany zapisane!");
    } catch (err: any) {
      alert("Błąd podczas zapisywania: " + err.message);
    }
  };

  // --- USUWANIE I EDYCJA ---
  const handleDelete = async (id: number) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten wpis?")) return;
    try {
      await apiService.delete(`/api/time-entries/${id}/`);
      setEntries(entries.filter(e => e.id !== id));
    } catch (err: any) {
      alert("Błąd: " + err.message);
    }
  };

  const handleEditClick = (entry: TimeEntry) => {
    setEditingId(entry.id);
    
    // Konwersja czasu z backendu na format inputu datetime-local
    const formatForInput = (isoString: string) => isoString.substring(0, 16);
    
    setStartTime(formatForInput(entry.start_time));
    setEndTime(entry.end_time ? formatForInput(entry.end_time) : "");
    setAmount(entry.amount_of_elements.toString());
    setMachineId(entry.machine.toString());
    setSelectedElementId(entry.element?.toString() || "");

    // Ustaw typ na podstawie wybranej maszyny
    const currentMachine = allMachines.find(m => m.id === entry.machine);
    if (currentMachine) setSelectedTypeId(currentMachine.id_type.toString());

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedTypeId("");
    setMachineId("");
    setSelectedElementId("");
    setAmount("1");
    setStartTime("");
    setEndTime("");
    setEstimatedTime(0);
  };

  // Pomocnicza nazwa maszyny w tabeli
  const getMachineName = (id: number) => {
    return allMachines.find(m => m.id === id)?.machine_name || `ID: ${id}`;
  };

  // Pomocnicza nazwa elementu
  const getElementName = (id: number) => {
    return allElements.find(e => e.id === id)?.element_name || `ID: ${id}`;
  };

  // Formatowanie czasu w minutach i godzinach
  const formatEstimatedTime = (totalMinutes: number) => {
    if (totalMinutes === 0) return "0 min";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} godz`;
    return `${hours} godz ${minutes} min`;
  };

  return (
    <>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className={`p-6 rounded-xl shadow-sm border ${editingId ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20' : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800'}`}>
          <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">
            {editingId ? "Edycja wpisu #" + editingId : "Dodaj nowy wpis czasu pracy"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            
            {/* Wybór typu maszyny */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Typ maszyny:</label>
              <select 
                value={selectedTypeId}
                onChange={(e) => {
                  setSelectedTypeId(e.target.value);
                  setMachineId(""); // Resetuj wybraną maszynę przy zmianie typu
                  setSelectedElementId(""); // Resetuj wybrany element
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              >
                <option value="" disabled>Wybierz typ...</option>
                {machineTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.type_name}</option>
                ))}
              </select>
            </div>

            {/* Wybór konkretnej maszyny (filtrowane) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Maszyna:</label>
              <select 
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                disabled={!selectedTypeId}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white disabled:opacity-50"
              >
                <option value="" disabled>Wybierz maszynę...</option>
                {filteredMachines.map(machine => (
                  <option key={machine.id} value={machine.id}>{machine.machine_name}</option>
                ))}
              </select>
            </div>

            {/* Wybór elementu (NOWE) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Element:
                {selectedElementId && (
                  <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                    (Szacowany czas: {formatEstimatedTime(estimatedTime)})
                  </span>
                )}
              </label>
              <select 
                value={selectedElementId}
                onChange={(e) => setSelectedElementId(e.target.value)}
                disabled={!selectedTypeId}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white disabled:opacity-50"
              >
                <option value="" disabled>Wybierz element...</option>
                {filteredElements.map(element => (
                  <option key={element.id} value={element.id}>
                    {element.element_name} ({element.estimated_time_per_item} min/szt)
                  </option>
                ))}
              </select>
            </div>

            {/* Ilość elementów */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ilość wykonanych elementów:
                {selectedElementId && estimatedTime > 0 && (
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    (Łącznie: ~{formatEstimatedTime(estimatedTime)})
                  </span>
                )}
              </label>
              <input 
                type="number" 
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              />
            </div>

            {/* Czas rozpoczęcia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Czas rozpoczęcia:</label>
              <input 
                type="datetime-local" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              />
            </div>

            {/* Czas zakończenia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Czas zakończenia (opcjonalne):</label>
              <input 
                type="datetime-local" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              />
            </div>

          </div>

          {/* Podsumowanie czasu pracy */}
          {selectedElementId && estimatedTime > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Szacowany czas pracy:</strong> {formatEstimatedTime(estimatedTime)} dla {amount} elementów
              </p>
            </div>
          )}

          <div className="flex gap-2 w-full md:w-1/2">
            {editingId ? (
              <>
                <button onClick={handleSaveChanges} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Zapisz zmiany
                </button>
                <button onClick={resetForm} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
                  Anuluj
                </button>
              </>
            ) : (
              <button onClick={handleAddEntry} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Dodaj wpis
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABELA WPISÓW */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Historia Twojej pracy</h2>
        {isLoading ? (
          <p className="text-gray-500">Ładowanie wpisów...</p>
        ) : entries.length === 0 ? (
          <p className="text-gray-500">Brak zarejestrowanych wejść.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-3">Maszyna</th>
                  <th className="px-4 py-3">Element</th>
                  <th className="px-4 py-3">Ilość</th>
                  <th className="px-4 py-3">Start</th>
                  <th className="px-4 py-3">Koniec</th>
                  <th className="px-4 py-3 text-right">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {getMachineName(entry.machine)}
                    </td>
                    <td className="px-4 py-3">
                      {entry.element ? getElementName(entry.element) : '-'}
                    </td>
                    <td className="px-4 py-3">{entry.amount_of_elements}</td>
                    <td className="px-4 py-3">{new Date(entry.start_time).toLocaleString('pl-PL')}</td>
                    <td className="px-4 py-3">{entry.end_time ? new Date(entry.end_time).toLocaleString('pl-PL') : '-'}</td>
                    <td className="px-4 py-3 flex justify-end gap-2">
                      <button onClick={() => handleEditClick(entry)} className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded">Edytuj</button>
                      <button onClick={() => handleDelete(entry.id)} className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded">Usuń</button>
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