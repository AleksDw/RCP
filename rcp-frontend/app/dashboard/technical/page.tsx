import RoleGuard from "@/app/components/RoleGuard";

export default function EmployeeDashboard() {
  return (
    <RoleGuard allowedRoles={['technical']}>
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Panel Technika
        </h1>
      </div>
    </div>
    </RoleGuard>
  );
}