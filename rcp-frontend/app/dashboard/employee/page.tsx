import Navbar from "../Navbar";
import RoleGuard from "@/app/components/RoleGuard";
import TimeEntryManager from "@/app/components/dashboard/TimeEntryManager";
export default function EmployeeDashboard() {
  return (
    <RoleGuard allowedRoles={['employee']}>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Panel Pracownika
          </h1>
          <TimeEntryManager />
          
        </div>
      </div>
    </RoleGuard>
  );
}