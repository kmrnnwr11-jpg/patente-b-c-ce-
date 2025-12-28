import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SchoolProvider } from '@/contexts/SchoolContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Patente Quiz Business | Dashboard Autoscuole',
    description: 'Gestisci la tua autoscuola con la dashboard di Patente Quiz. Monitora i progressi degli studenti, crea report e aumenta il tasso di successo.',
    keywords: 'autoscuola, patente, quiz, dashboard, gestione studenti, esame teorico',
    authors: [{ name: 'Patente Quiz' }],
    openGraph: {
        title: 'Patente Quiz Business',
        description: 'La piattaforma #1 per autoscuole moderne',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="it">
            <body className={inter.className}>
                <SchoolProvider>
                    <div className="min-h-screen bg-gray-50">
                        <Sidebar />
                        <Header />
                        <main className="lg:ml-64 pt-16 min-h-screen">
                            <div className="p-6">
                                {children}
                            </div>
                        </main>
                    </div>
                </SchoolProvider>
            </body>
        </html>
    );
}
