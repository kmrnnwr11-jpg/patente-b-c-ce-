import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Patente B Quiz - Admin Dashboard',
    description: 'Dashboard amministrativa per gestire l\'app Patente B Quiz',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="it">
            <body className={inter.className}>
                <div className="flex min-h-screen bg-gray-50">
                    <Sidebar />
                    <div className="ml-64 flex-1">
                        <Header />
                        <main className="p-6">{children}</main>
                    </div>
                </div>
            </body>
        </html>
    );
}
