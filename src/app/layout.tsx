import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

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
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-100 via-blue-100 to-gray-100 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-stone-900/40 z-[-1]"></div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
