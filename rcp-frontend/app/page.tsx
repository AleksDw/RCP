import LoginView from "./components/auth/LoginView";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-50 dark:bg-neutral-950">
      <LoginView />
    </main>
  );
}