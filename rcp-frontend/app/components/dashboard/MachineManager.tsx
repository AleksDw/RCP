"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/apiService";

interface MachineType {
  id: number;
  type_name: string;
}

interface Machine {
  id: number;
  machine_name: string;
  id_type: number;
}

export default function MachineManager() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [machineName, setMachineName] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [machinesData, typesData] = await Promise.all([
        apiService.get('/api/machines/'),
        apiService.get('/api/machine-types/')
      ]);
      setMachines(machinesData);
      setMachineTypes(typesData);
    } catch (err: any) {
      setError("Nie udało się pobrać maszyn.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setMachineName("");
    setSelectedTypeId("");
  };

  const handleAdd = async () => {
    if (!machineName.trim() || !selectedTypeId) {
      alert("Podaj nazwę i wybierz typ maszyny.");
      return;
    }
    try {
      const newMachine = await apiService.post('/api/machines/', {
        machine_name: machineName.trim(),
        id_type: parseInt(selectedTypeId)
      });
      setMachines([newMachine, ...machines]);
      resetForm();
    } catch (err: any) {
      alert("Błąd dodawania: " + err.message);
    }
  };

  const handleSave = async () => {
    if (!editingId || !machineName.trim() || !selectedTypeId) return;
    try {
      const updated = await apiService.patch(`/api/machines/${editingId}/`, {
        machine_name: machineName.trim(),
        id_type: parseInt(selectedTypeId)
      });
      setMachines(machines.map(m => m.id === editingId ? updated : m));
      resetForm();
    } catch (err: any) {
      alert("Błąd edycji: " + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Usunąć tę maszynę?")) return;
    try {
      await apiService.delete(`/api/machines/${id}/`);
      setMachines(machines.filter(m => m.id !== id));
    } catch (err: any) {
      alert("Błąd usuwania: " + err.message);
    }
  };

  const handleEdit = (machine: Machine) => {
    setEditingId(machine.id);
    setMachineName(machine.machine_name);
    setSelectedTypeId(machine.id_type.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTypeName = (id_type: number) => {
    return machineTypes.find(t => t.id === id_type)?.type_name || `ID: ${id_type}`;
  };

  return (
    <div className="mb-8">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className={`p-6 rounded-xl shadow-sm border mb-6 ${editingId ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20' : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800'}`}>
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
          {editingId ? "Edytuj maszynę #" + editingId : "Dodaj maszynę"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nazwa maszyny</label>
            <input
              type="text"
              value={machineName}
              onChange={(e) => setMachineName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Typ maszyny</label>
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
            >
              <option value="" disabled>Wybierz typ...</option>
              {machineTypes.map(type => (
                <option key={type.id} value={type.id}>{type.type_name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {editingId ? (
            <>
              <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">Zapisz</button>
              <button onClick={resetForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors">Anuluj</button>
            </>
          ) : (
            <button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">Dodaj</button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Lista maszyn</h3>
        {isLoading ? (
          <p className="text-gray-500">Ładowanie...</p>
        ) : machines.length === 0 ? (
          <p className="text-gray-500">Brak maszyn.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-3">Nazwa</th>
                  <th className="px-4 py-3">Typ</th>
                  <th className="px-4 py-3 text-right">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {machines.map(machine => (
                  <tr key={machine.id} className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{machine.machine_name}</td>
                    <td className="px-4 py-3">{getTypeName(machine.id_type)}</td>
                    <td className="px-4 py-3 flex justify-end gap-2">
                      <button onClick={() => handleEdit(machine)} className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded">Edytuj</button>
                      <button onClick={() => handleDelete(machine.id)} className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded">Usuń</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}