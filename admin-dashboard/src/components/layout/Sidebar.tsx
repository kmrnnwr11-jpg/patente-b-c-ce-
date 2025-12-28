'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Ticket,
    Megaphone,
    Star,
    BarChart3,
    Bell,
    Shield,
    Settings,
    LogOut,
    Building2,
    Smartphone,
    ExternalLink,
} from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Utenti', icon: Users, href: '/users' },
    { name: 'Abbonamenti', icon: CreditCard, href: '/subscriptions' },
    { name: 'Promo Codes', icon: Ticket, href: '/promo-codes' },
    { name: 'Promoter', icon: Megaphone, href: '/promoters' },
    { name: 'Utenti Speciali', icon: Star, href: '/special-users' },
    { name: 'Analytics', icon: BarChart3, href: '/analytics' },
    { name: 'Notifiche', icon: Bell, href: '/notifications' },
    { name: 'Sicurezza', icon: Shield, href: '/security' },
    { name: 'Impostazioni', icon: Settings, href: '/settings' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col bg-gradient-to-b from-purple-900 to-purple-950 text-white">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-purple-800 px-6 shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <span className="text-2xl">🚗</span>
                </div>
                <div>
                    <h1 className="font-bold">Patente B</h1>
                    <p className="text-xs text-purple-300">Admin Dashboard</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                                isActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-purple-200 hover:bg-white/10 hover:text-white'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}

                <div className="my-4 border-t border-purple-800/50" />

                {/* External Apps */}
                <div className="px-2">
                    <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2 px-2">
                        Collegamenti
                    </p>
                    <a
                        href="http://localhost:3001"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-purple-200 transition-all hover:bg-indigo-500/20 hover:text-white mb-1"
                    >
                        <Building2 className="h-5 w-5" />
                        School Dashboard
                        <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                    </a>
                    <a
                        href="http://localhost:8081"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-purple-200 transition-all hover:bg-emerald-500/20 hover:text-white"
                    >
                        <Smartphone className="h-5 w-5" />
                        App Studenti
                        <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
                    </a>
                </div>
            </nav>

            {/* Logout */}
            <div className="border-t border-purple-800 p-4 shrink-0">
                <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-purple-200 transition-all hover:bg-white/10 hover:text-white">
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
