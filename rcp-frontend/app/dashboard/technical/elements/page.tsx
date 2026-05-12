import RoleGuard from "@/app/components/RoleGuard";
import ElementManager from "@/app/components/dashboard/ElementManager";
import BackButton from "@/app/components/BackButton";
import Navbar from "../../Navbar";

export default function ElementsPage() {
  return (
    <RoleGuard allowedRoles={['technical']}>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
        <div className="max-w-4xl mx-auto">
          <BackButton href="/dashboard/technical" label="← Powrót do panelu technika"/>
          <ElementManager />
        </div>
      </div>
    </RoleGuard>
  );
}