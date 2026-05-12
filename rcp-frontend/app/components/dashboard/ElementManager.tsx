"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/apiService";

interface MachineType {
  id: number;
  type_name: string;
}

interface Element {
  id: number;
  element_name: string;
  id_type: number;
  estimated_time_per_item: number;
}

export default function ElementManager() {
  const [elements, setElements] = useState<Element[]>([]);
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [elementName, setElementName] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("1");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [elementsData, typesData] = await Promise.all([
        apiService.get('/api/elements/'),
        apiService.get('/api/machine-types/')
      ]);
      setElements(elementsData);
      setMachineTypes(typesData);
    } catch (err: any) {
      setError("Nie udało się pobrać elementów.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setElementName("");
    setSelectedTypeId("");
    setEstimatedTime("1");
  };

  const validateEstimatedTime = (value: string): boolean => {
    const num = parseInt(value);
    return !isNaN(num) && num > 0;
  }

  const handleAdd = async () => {
    if (!elementName.trim() || !selectedTypeId) {
      alert("Podaj nazwę i typ maszyny.");
      return;
    }
    if (!validateEstimatedTime(estimatedTime)) {
        alert("Szacowany czas musi być liczbą całkowitą większą od 0.");
        return;
    }
    try {
      const newElement = await apiService.post('/api/elements/', {
        element_name: elementName.trim(),
        id_type: parseInt(selectedTypeId),
        estimated_time_per_item: parseInt(estimatedTime) || 0
      });
      setElements([newElement, ...elements]);
      resetForm();
    } catch (err: any) {
      alert("Błąd dodawania: " + err.message);
    }
  };

  const handleSave = async () => {
    if (!editingId || !elementName.trim() || !selectedTypeId) return;
    if (!validateEstimatedTime(estimatedTime)) {
        alert("Szacowany czas musi być liczbą całkowitą większą od 0.");
        return;
    }
    try {
      const updated = await apiService.patch(`/api/elements/${editingId}/`, {
        element_name: elementName.trim(),
        id_type: parseInt(selectedTypeId),
        estimated_time_per_item: parseInt(estimatedTime) || 0
      });
      setElements(elements.map(el => el.id === editingId ? updated : el));
      resetForm();
    } catch (err: any) {
      alert("Błąd edycji: " + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Usunąć ten element?")) return;
    try {
      await apiService.delete(`/api/elements/${id}/`);
      setElements(elements.filter(el => el.id !== id));
    } catch (err: any) {
      alert("Błąd usuwania: " + err.message);
    }
  };

  const handleEdit = (element: Element) => {
    setEditingId(element.id);
    setElementName(element.element_name);
    setSelectedTypeId(element.id_type.toString());
    setEstimatedTime(element.estimated_time_per_item.toString());
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
          {editingId ? "Edytuj element #" + editingId : "Dodaj element"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nazwa elementu</label>
            <input
              type="text"
              value={elementName}
              onChange={(e) => setElementName(e.target.value)}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Szacowany czas (min)</label>
            <input
              type="number"
              min="0"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
            />
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
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Lista elementów</h3>
        {isLoading ? (
          <p className="text-gray-500">Ładowanie...</p>
        ) : elements.length === 0 ? (
          <p className="text-gray-500">Brak elementów.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-3">Nazwa</th>
                  <th className="px-4 py-3">Typ maszyny</th>
                  <th className="px-4 py-3">Szac. czas (min)</th>
                  <th className="px-4 py-3 text-right">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {elements.map(element => (
                  <tr key={element.id} className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{element.element_name}</td>
                    <td className="px-4 py-3">{getTypeName(element.id_type)}</td>
                    <td className="px-4 py-3">{element.estimated_time_per_item}</td>
                    <td className="px-4 py-3 flex justify-end gap-2">
                      <button onClick={() => handleEdit(element)} className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded">Edytuj</button>
                      <button onClick={() => handleDelete(element.id)} className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded">Usuń</button>
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