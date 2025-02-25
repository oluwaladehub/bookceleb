"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/admin/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        router.push('/');
        return;
      }

      setFullName(profile.full_name || '');
    };

    checkAdmin();
  }, [router]);

  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/signup');

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAuthPage && (
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                  <span className="text-gray-700 font-medium">Welcome {fullName}</span>
                  <a
                    href="/admin"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/admin/celebrities"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Celebrities
                  </a>
                  <a
                    href="/admin/bookings"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Bookings
                  </a>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      router.push('/admin/login');
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className={`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ${isAuthPage ? 'flex items-center justify-center' : ''}`}>
        {children}
      </main>
    </div>
  );
}