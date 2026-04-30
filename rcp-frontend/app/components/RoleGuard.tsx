"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');

    if (!role) {
      router.push('/');
      return;
    }

    if (!allowedRoles.includes(role)) {
      if (role === 'technical') {
        router.push('/dashboard/technical');
      } 
      else if (role === 'employer') {
        router.push('/dashboard/employer');
      } 
      else if (role == "employee"){
        router.push('/dashboard/employee')
      }
      else {
        router.push('/');
      }
      return;
    }

    setIsAuthorized(true);
  }, [router, allowedRoles]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Wait...</p>
      </div>
    );
  }
  return <>{children}</>;
}