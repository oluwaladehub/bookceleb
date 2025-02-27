"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
        <nav className="bg-white shadow-md fixed w-full top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
              <div className="flex items-center justify-between mb-4 md:mb-0">
                <div className="flex-shrink-0 flex items-center">
                  <img src="/logo_white.png" alt="Logo" className="h-8 w-auto bg-black" />
                </div>
                <span className="text-gray-700 font-medium ml-4">Welcome {fullName}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
                <a
                  href="/admin"
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="/admin/celebrities"
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Celebrities
                </a>
                <a
                  href="/admin/messages"
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Messages
                </a>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full md:w-auto justify-center"
                    >
                      Logout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to log out? You will need to sign in again to access the admin panel.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          await supabase.auth.signOut();
                          router.push('/admin/login');
                        }}
                      >
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className={`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ${isAuthPage ? 'flex items-center justify-center' : 'mt-[80px]'}`}>
        {children}
      </main>
    </div>
  );
}