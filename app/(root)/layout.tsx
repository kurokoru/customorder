'use client';
import React, { useState, useEffect } from 'react';
import NextTopLoader from 'nextjs-toploader';
interface RootLayoutProps {
  children: React.ReactNode;
}
import Link from 'next/link';
import { Menu, TriangleAlert, PanelLeft, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { ModeToggle } from '@/components/darkmode/darkmode';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/dashboard/navbar';
import { NavbarSheet } from '@/components/dashboard/NavbarSheet';
import Bread from '@/components/dashboard/breadcrumb';
import { toast } from 'react-toastify';
import axios from 'axios';
import eventBus from '@/lib/even';
const RootLayout = ({ children }: RootLayoutProps) => {
  const [storeName, setStoreName] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const isOnline = navigator.onLine;

        if (!isOnline) {
          toast.error(
            'You are offline. Please check your internet connection.'
          );
          return;
        }

        const response = await axios.get('/api/shopdata');
        const shopdata = response.data.data;

        if (response.status === 200) {
          setStoreName(shopdata.name);
        } else {
          toast.error('Failed to fetch data: ' + shopdata.error);
        }
      } catch (error: any) {
        toast.error(
          'Failed to fetch data: ' +
            (error.response?.data.error || error.message)
        );
      }
    };

    // fetchShopData();

    const handleEventBusEvent = () => {
      fetchShopData();
    };

    eventBus.on('fetchStoreData', handleEventBusEvent);

    // Clean up event listener
    return () => {
      eventBus.removeListener('fetchStoreData', handleEventBusEvent);
    };
  }, []);
  return (
    <div className="bg-gray-300 dark:bg-black">
      <div className={`grid min-h-screen w-full ${sidebarVisible ? 'md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]' : 'grid-cols-1'}`}>
        {sidebarVisible && (
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-10 items-center border-b px-4 lg:h-[40px] lg:px-6">
                <Link href="/orders/custom/wizard" className="flex items-center gap-2 font-semibold">
                  {/* <TriangleAlert className="h-6 w-6" /> */}
                  <span className="">Pesona Indah Rooms & Restaurant</span>
                </Link>
              </div>
              {/* <Navbar /> */}
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <header className="flex h-10 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[40px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <NavbarSheet />
            </Sheet>
            
            {/* Centered Restaurant Name */}
            <div className="flex-1 flex justify-center items-center">
              <img 
                src="/pesonaindahicon.png" 
                alt="Pesona Indah Icon" 
                className="w-6 h-6 mr-2 rounded-full"
              />
              <span className="font-semibold">Pesona Indah Rooms & Restaurant</span>
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-2 p-2 lg:gap-6 lg:p-6">
            <div
              className="flex flex-1 items-center justify-center"
              x-chunk="dashboard-02-chunk-1"
            >
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <NextTopLoader showSpinner={false} />
                {children}
              </ThemeProvider>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
