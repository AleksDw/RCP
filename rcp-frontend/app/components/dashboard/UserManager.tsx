"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/apiService";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'employee' | 'employer' | 'technical';
}

const ROLE_LABELS: Record<string, string> = {
  'employee': 'Pracownik',
  'employer': 'Pracodawca',
  'technical': 'Technik'
};

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("employee");
  const [password, setPassword] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const usersData = await apiService.get('/api/users/');
      setUsers(usersData);
    } catch (err: any) {
      setError("Nie udało się pobrać użytkowników.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setUsername("");
    setRole("employee");
    setPassword("");
  };

  const validateForm = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !username.trim()) {
      alert("Wszystkie pola są wymagane.");
      return false;
    }
    if (!editingId && !password.trim()) {
      alert("Hasło jest wymagane dla nowego użytkownika.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Podaj prawidłowy adres email.");
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    
    try {
      const userData: any = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        username: username.trim(),
        role: role
      };
      
      if (password.trim()) {
        userData.password = password;
      }
      
      const newUser = await apiService.post('/api/users/', userData);
      setUsers([newUser, ...users]);
      resetForm();
    } catch (err: any) {
      alert("Błąd dodawania: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleSave = async () => {
    if (!editingId || !validateForm()) return;
    
    try {
      const userData: any = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        username: username.trim(),
        role: role
      };
      
      if (password.trim()) {
        userData.password = password;
      }
      
      const updated = await apiService.patch(`/api/users/${editingId}/`, userData);
      setUsers(users.map(u => u.id === editingId ? updated : u));
      resetForm();
    } catch (err: any) {
      alert("Błąd edycji: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;
    try {
      await apiService.delete(`/api/users/${id}/`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err: any) {
      alert("Błąd usuwania: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
    setUsername(user.username);
    setRole(user.role);
    setPassword(""); // Nie wypełniamy hasła przy edycji
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRoleLabel = (role: string) => {
    return ROLE_LABELS[role] || role;
  };

  return (
    <div className="mb-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className={`p-6 rounded-xl shadow-sm border mb-6 transition-colors ${
        editingId 
          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
          : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800'
      }`}>
        <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
          {editingId ? `Edytuj użytkownika #${editingId}` : "Dodaj nowego użytkownika"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Imię *
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jan"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nazwisko *
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Kowalski"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jan@example.com"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nazwa użytkownika *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jankowalski"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rola *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="employee">Pracownik</option>
              <option value="employer">Pracodawca</option>
              <option value="technical">Technik</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {editingId ? "Nowe hasło (opcjonalne)" : "Hasło *"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={editingId ? "Pozostaw puste aby nie zmieniać" : "Wprowadź hasło"}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          {editingId ? (
            <>
              <button 
                onClick={handleSave} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Zapisz zmiany
              </button>
              <button 
                onClick={resetForm} 
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition-colors font-medium"
              >
                Anuluj
              </button>
            </>
          ) : (
            <button 
              onClick={handleAdd} 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
            >
              Dodaj użytkownika
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
          Lista użytkowników ({users.length})
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Brak użytkowników w systemie.</p>
            <p className="text-sm mt-2">Dodaj pierwszego użytkownika używając formularza powyżej.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Imię</th>
                  <th className="px-4 py-3 font-medium">Nazwisko</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Username</th>
                  <th className="px-4 py-3 font-medium">Rola</th>
                  <th className="px-4 py-3 text-right font-medium">Akcje</th>
                </tr>
              </thead>
              <tbody className="text-gray-500 dark:text-gray-400">
                {users.map(user => (
                  <tr 
                    key={user.id} 
                    className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {user.first_name}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {user.last_name}
                    </td>
                    <td className="px-4 py-3">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      {user.username}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.role === 'employer' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : ''}
                        ${user.role === 'employee' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                        ${user.role === 'technical' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                      `}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(user)} 
                          className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded transition-colors"
                        >
                          Edytuj
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)} 
                          className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                        >
                          Usuń
                        </button>
                      </div>
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