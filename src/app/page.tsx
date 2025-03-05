import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Moi Tech Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/moi-entries" 
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Moi Entries</h2>
            <p className="text-gray-600 dark:text-gray-300">Manage and track all moi contributions</p>
          </Link>

          <Link href="/material-entries"
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Material Entries</h2>
            <p className="text-gray-600 dark:text-gray-300">Track material inventory and usage</p>
          </Link>

          <Link href="/finance"
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Finance</h2>
            <p className="text-gray-600 dark:text-gray-300">Monitor financial transactions and reports</p>
          </Link>

          <Link href="/dashboard"
                className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-300">View overall statistics and insights</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
