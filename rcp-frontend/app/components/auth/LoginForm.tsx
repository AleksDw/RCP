"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/apiService"; 

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await apiService.post('/api/login/', {
        username: identifier, 
        password: password
      });

      const fullName = `${response.first_name} ${response.last_name}`.trim();
      localStorage.setItem('user_name', fullName || response.username);
      
      if (response.access) {
        localStorage.setItem('access', response.access);
      } else if (response.token) { 
        localStorage.setItem('access', response.token); 
      }

      localStorage.setItem('role', response.role);

      if (response.role === "employee") {
        router.push("/dashboard/employee");
      } else if (response.role === "technical") {
        router.push("/dashboard/technical");
      } else {
        router.push("/dashboard/employer");
      }
      
    } catch (err: any) {
      setError(err.message || "Nie udało się zalogować. Sprawdź dane.");
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email lub Login
          </label>
          <input
            id="identifier"
            name="username"
            autoComplete="username"
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:text-sm"
            placeholder="email lub login"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Hasło
          </label>
          <input
            id="password"
            name="password"
            autoComplete="current-password"
            type="password"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:text-sm"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
      >
        Zaloguj się
      </button>
    </form>
  );
}