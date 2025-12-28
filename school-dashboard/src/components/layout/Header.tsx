'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    Search,
    Bell,
    Plus,
    ChevronDown,
    Menu,
    X,
} from 'lucide-react';
import { useSchool } from '@/contexts/SchoolContext';
import { cn } from '@/lib/utils';

const pageTitles: Record<string, string> = {
    '/': 'Dashboard',
    '/students': 'Studenti',
    '/instructors': 'Istruttori',
    '/reports': 'Report',
    '/messages': 'Messaggi',
    '/settings': 'Impostazioni',
    '/settings/billing': 'Abbonamento',
    '/help': 'Assistenza',
};

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const pathname = usePathname();
    const { school, instructor } = useSchool();
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Get page title
    const getTitle = () => {
        if (pathname.startsWith('/students/')) return 'Dettaglio Studente';
        return pageTitles[pathname] || 'Dashboard';
    };

    // Don't show on marketing/auth pages
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        return null;
    }

    // Mock notifications
    const notifications = [
        { id: 1, title: 'Nuovo studente iscritto', message: 'Marco Bianchi si è iscritto', time: '5 min fa', read: false },
        { id: 2, title: 'Studente pronto', message: 'Laura Verdi ha superato la simulazione', time: '1 ora fa', read: false },
        { id: 3, title: 'Abbonamento', message: 'Il trial scade tra 3 giorni', time: '2 ore fa', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-30">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Page title */}
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">{getTitle()}</h1>
                        {school?.planStatus === 'trial' && (
                            <p className="text-xs text-amber-600">
                                🎁 Trial attivo - {school.trialEndsAt ? `scade il ${new Date(school.trialEndsAt).toLocaleDateString('it-IT')}` : ''}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cerca studenti..."
                            className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Quick add button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Aggiungi</span>
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications dropdown */}
                        {showNotifications && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowNotifications(false)}
                                />
                                <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="p-4 border-b flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900">Notifiche</h3>
                                        <button className="text-xs text-indigo-600 hover:underline">
                                            Segna tutte lette
                                        </button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    'p-4 border-b hover:bg-gray-50 cursor-pointer',
                                                    !notification.read && 'bg-indigo-50/50'
                                                )}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={cn(
                                                        'w-2 h-2 rounded-full mt-2',
                                                        notification.read ? 'bg-gray-300' : 'bg-indigo-600'
                                                    )} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 border-t">
                                        <button className="w-full text-center text-sm text-indigo-600 hover:underline">
                                            Vedi tutte le notifiche
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
