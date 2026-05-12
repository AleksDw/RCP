"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/apiService";

interface MachineType {
    id: number;
    type_name: string;
}

export default function MachineTypeManager() {
    const [types, setTypes] = useState<MachineType[]>([]);
    const [isLoading, setIsLoading]= useState(true);
    const [error, setError] = useState("");
    
    const [editingId, setEditingId] = useState<number | null>(null);
    const [typeName, setTypeName] = useState("");

    const fetchTypes = async () => {
        try {
            setIsLoading(true);
            const data = await apiService.get('/api/machine-types/');
            setTypes(data);
        } catch(err: any) {
            setError("Nie udało się pobrać typów maszyn.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setTypeName("");
    };

    const handleAdd = async () => {
        if(!typeName.trim()) {
            alert("Podaj nazwę typu maszyny.");
            return;
        }
        try {
            const newType = await apiService.post('/api/machine-types/', {type_name: typeName.trim()});
            setTypes([newType, ...types]);
            resetForm();
        } catch (err: any) {
            alert("Błąd dodawania: " + err.message);
        }
    };

    const handleSave = async () => {
        if (!editingId || !typeName.trim()) return;
        try {
            const updated = await apiService.patch(`/api/machine-types/${editingId}/`, {type_name: typeName.trim()});
            setTypes(types.map(t => t.id === editingId ? updated : t));
            resetForm();
        } catch (err: any) {
            alert("Błąd edycji: " + err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Usunąć ten typ maszyny?")) return;
        try {
            await apiService.delete(`/api/machine-types/${id}/`);
            setTypes(types.filter(t => t.id !== id));
        } catch (err: any) {
            alert("Błąd usuwania: " + err.message);
        }
    };

    const handleEdit = (type: MachineType) => {
        setEditingId(type.id);
        setTypeName(type.type_name);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
        <div className="mb-8">
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Formularz */}
            <div className={`p-6 rounded-xl shadow-sm border mb-6 ${editingId ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20' : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800'}`}>
                <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
                    {editingId ? "Edytuj typ maszyny #" + editingId : "Dodaj typ maszyny"}
                </h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                        type="text"
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                        placeholder="Nazwa typu"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" />
                    <div className="flex gap-2">
                        {editingId ? (
                            <>
                                <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                                    Zapisz
                                </button>
                                <button onClick={resetForm} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors">
                                    Anuluj     
                                </button>
                            </>
                        ) : (
                            <button onClick={handleAdd} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                                Dodaj
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Lista typów maszyn</h3>
                {isLoading ? (
                <p className="text-gray-500">Ładowanie...</p>
                ) : types.length === 0 ? (
                <p className="text-gray-500">Brak zdefiniowanych typów.</p>
                ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-200">
                        <tr>
                        <th className="px-4 py-3">Nazwa</th>
                        <th className="px-4 py-3 text-right">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {types.map(type => (
                        <tr key={type.id} className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{type.type_name}</td>
                            <td className="px-4 py-3 flex justify-end gap-2">
                            <button onClick={() => handleEdit(type)} className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded">Edytuj</button>
                            <button onClick={() => handleDelete(type.id)} className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded">Usuń</button>
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