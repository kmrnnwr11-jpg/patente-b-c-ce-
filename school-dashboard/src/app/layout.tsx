'use client';

import './globals.css';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BarChart3,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    School,
    CreditCard,
} from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Studenti', icon: Users, href: '/students' },
    { name: 'Istruttori', icon: GraduationCap, href: '/instructors' },
    { name: 'Report', icon: BarChart3, href: '/reports' },
    { name: 'Messaggi', icon: MessageSquare, href: '/messages' },
    { name: 'Impostazioni', icon: Settings, href: '/settings' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Skip layout for login/register pages
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');

    if (isAuthPage) {
        return (
            <html lang="it">
                <body className="bg-gray-50">{children}</body>
            </html>
        );
    }

    return (
        <html lang="it">
            <body className="bg-gray-50">
                <div className="flex h-screen">
                    {/* Sidebar */}
                    <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-indigo-900 text-white transform transition-transform duration-300
            lg:relative lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
                        {/* Logo */}
                        <div className="flex items-center justify-between h-16 px-6 border-b border-indigo-800">
                            <div className="flex items-center gap-2">
                                <School className="w-8 h-8" />
                                <div>
                                    <h1 className="text-lg font-bold">Patente Quiz</h1>
                                    <p className="text-xs text-indigo-300">Business</p>
                                </div>
                            </div>
                            <button
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Autoscuola Info */}
                        <div className="px-4 py-4 border-b border-indigo-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center">
                                    <span className="text-lg font-bold">AR</span>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Autoscuola Roma</p>
                                    <p className="text-xs text-indigo-300">Piano Pro</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-4 space-y-1">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/' && pathname?.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive
                                                ? 'bg-indigo-700 text-white'
                                                : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}
                    `}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer */}
                        <div className="p-4 border-t border-indigo-800">
                            <Link
                                href="/settings/billing"
                                className="flex items-center gap-3 px-4 py-3 text-indigo-200 hover:bg-indigo-800 rounded-lg"
                            >
                                <CreditCard className="w-5 h-5" />
                                <span>Abbonamento</span>
                            </Link>
                            <button className="flex items-center gap-3 px-4 py-3 text-indigo-200 hover:bg-indigo-800 rounded-lg w-full">
                                <LogOut className="w-5 h-5" />
                                <span>Esci</span>
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Top Header */}
                        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                            <button
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            <div className="flex-1 lg:flex-none">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {menuItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                                </h2>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium text-gray-700">Mario Rossi</p>
                                    <p className="text-xs text-gray-500">Proprietario</p>
                                </div>
                                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                                    MR
                                </div>
                            </div>
                        </header>

                        {/* Page Content */}
                        <main className="flex-1 overflow-auto p-6">
                            {children}
                        </main>
                    </div>
                </div>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </body>
        </html>
    );
}
