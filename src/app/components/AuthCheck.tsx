'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientOnly from './ClientOnly';

interface AuthCheckProps {
  children: React.ReactNode;
}

export default function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          // No user found, redirect to login
          router.push('/login');
          return;
        }
        
        // User exists in localStorage
        setIsAuthenticated(true);
      } catch (error) {
        // Error accessing localStorage or parsing user data
        console.error('Authentication error:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Use ClientOnly to ensure this only runs on the client side
  return (
    <ClientOnly>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#D4A76A] mb-4"></div>
            <p className="text-[#6C757D] font-medium">Checking authentication...</p>
          </div>
        </div>
      ) : isAuthenticated ? (
        children
      ) : null}
    </ClientOnly>
  );
}