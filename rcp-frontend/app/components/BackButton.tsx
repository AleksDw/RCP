import Link from "next/link";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export default function BackButton({ href = "", label = "← Powrót do panelu" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4"
    >
      {label}
    </Link>
  );
}