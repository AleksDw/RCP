import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-xl shadow-md border border-gray-100 dark:border-neutral-800">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Witaj w systemie RCP
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Wprowadź swoje dane, aby się zalogować
          </p>
        </div>
        
        {}
        <LoginForm />
        
      </div>
    </div>
  );
}