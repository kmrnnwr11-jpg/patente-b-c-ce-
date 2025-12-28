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
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-purple-900 to-purple-950 text-white">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b border-purple-800 px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <span className="text-2xl">🚗</span>
                </div>
                <div>
                    <h1 className="font-bold">Patente B</h1>
                    <p className="text-xs text-purple-300">Admin Dashboard</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-4">
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
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-purple-800 p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-purple-200 transition-all hover:bg-white/10 hover:text-white">
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
