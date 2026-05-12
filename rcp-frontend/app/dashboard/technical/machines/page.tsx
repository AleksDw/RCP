import RoleGuard from "@/app/components/RoleGuard";
import MachineManager from "@/app/components/dashboard/MachineManager";
import BackButton from "@/app/components/BackButton";
import Navbar from "../../Navbar";

export default function MachinesPage() {
  return (
    <RoleGuard allowedRoles={['technical']}>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
        <div className="max-w-4xl mx-auto">
          <BackButton href="/dashboard/technical" label="← Powrót do panelu technika"/>
          <MachineManager />
        </div>
      </div>
    </RoleGuard>
  );
}