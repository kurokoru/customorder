'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the POS interface
    router.replace('/orders/custom/wizard');
  }, [router]);

  // Show nothing or a loading state while redirecting
  return null;
}
