'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#0B0D10] text-[#5E6AD2]">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
