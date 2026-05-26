import RoleGuard from "@/app/components/RoleGuard";
import BackButton from "@/app/components/BackButton";
import Navbar from "../../Navbar";
import TimeEntryEmployerManager from "@/app/components/dashboard/TimeEntryEmployerManager";

export default function StatisticsPage() {
  return (
    <RoleGuard allowedRoles={['employer']}>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
        <div className="max-w-4xl mx-auto">
          <BackButton href="/dashboard/employer" label="← Powrót do panelu pracodawcy"/>
          <TimeEntryEmployerManager />
        </div>
      </div>
    </RoleGuard>
  );
}