import type {Metadata} from 'next';
import './globals.css';
import Link from 'next/link';
import { Toaster } from "@/components/ui/toaster";
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { FileText, Users, Scaling, Building2, FileCheck, Info, Phone, LayoutDashboard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'VentureLens AI',
  description: 'AI-powered due diligence for venture capital.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background">
        <SidebarProvider>
          <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-teal-100 via-blue-100 to-gray-100 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-stone-900/40 z-[-1]"></div>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
              <Sidebar side="left" className="glass-nav !border-r !border-white/10 md:w-64 hidden md:flex flex-col" collapsible="none">
                  <SidebarMenu className="p-4 space-y-2 flex-1">
                     <SidebarMenuItem>
                        <Button variant="ghost" asChild className="justify-start w-full">
                            <Link href="/"><LayoutDashboard />Dashboard</Link>
                        </Button>
                      </SidebarMenuItem>
                  </SidebarMenu>
                 <div className="p-4 mt-auto border-t border-border/50">
                    <nav className="flex flex-col gap-2">
                        <Button variant="ghost" asChild className="justify-start">
                          <Link href="/about"><Info className="mr-2"/>About</Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start">
                          <Link href="/contact"><Phone className="mr-2"/>Contact</Link>
                        </Button>
                    </nav>
                </div>
              </Sidebar>
               <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
