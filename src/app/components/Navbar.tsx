'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link href="/" className="text-xl font-bold">Moi Tech</Link>
        <div className="flex space-x-4">
          <Link
            href="/dashboard"
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/dashboard')}`}
          >
            Dashboard
          </Link>
          <Link
            href="/moi-entries"
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/moi-entries')}`}
          >
            Moi Entries
          </Link>
          <Link
            href="/material-entries"
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/material-entries')}`}
          >
            Material Entries
          </Link>
          <Link
            href="/finance"
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/finance')}`}
          >
            Finance
          </Link>
        </div>
      </div>
    </nav>
  );
}