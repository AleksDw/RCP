import RoleGuard from "@/app/components/RoleGuard";
import UserManager from "@/app/components/dashboard/UserManager";
import BackButton from "@/app/components/BackButton";
import Navbar from "../../Navbar";

export default function UserPage() {
  return (
    <RoleGuard allowedRoles={['employer']}>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-8">
        <div className="max-w-4xl mx-auto">
          <BackButton href="/dashboard/employer" label="← Powrót do panelu pracodawcy"/>
          <UserManager />
        </div>
      </div>
    </RoleGuard>
  );
}