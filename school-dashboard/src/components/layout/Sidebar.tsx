'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    UserCog,
    BarChart3,
    MessageSquare,
    Settings,
    CreditCard,
    HelpCircle,
    LogOut,
    ChevronDown,
    Building2,
    Smartphone,
    ExternalLink,
} from 'lucide-react';
import { useSchool } from '@/contexts/SchoolContext';
import { cn } from '@/lib/utils';

const mainNavItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/students', label: 'Studenti', icon: Users },
    { href: '/instructors', label: 'Istruttori', icon: UserCog },
    { href: '/reports', label: 'Report', icon: BarChart3 },
    { href: '/messages', label: 'Messaggi', icon: MessageSquare },
];

const secondaryNavItems = [
    { href: '/settings', label: 'Impostazioni', icon: Settings },
    { href: '/settings/billing', label: 'Abbonamento', icon: CreditCard },
    { href: '/help', label: 'Assistenza', icon: HelpCircle },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { school, instructor, logout, isOwner } = useSchool();

    // Don't show sidebar on marketing/auth pages
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        return null;
    }

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col z-40">
            {/* Logo */}
            <div className="p-4 border-b">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">PQ</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">Patente Quiz</p>
                        <p className="text-xs text-gray-500">Business</p>
                    </div>
                </Link>
            </div>

            {/* School Info */}
            {school && (
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        {school.logoUrl ? (
                            <img
                                src={school.logoUrl}
                                alt={school.name}
                                className="w-10 h-10 rounded-lg object-cover"
                            />
                        ) : (
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: school.primaryColor || '#4F46E5' }}
                            >
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">
                                {school.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {school.planStatus === 'trial' ? '🎁 Trial' : `Piano ${school.plan}`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                    active
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <Icon className={cn('w-5 h-5', active ? 'text-indigo-600' : 'text-gray-400')} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-gray-100" />

                {/* Secondary Navigation */}
                <div className="space-y-1">
                    {secondaryNavItems
                        .filter(item => {
                            // Only owners can see billing
                            if (item.href === '/settings/billing' && !isOwner) return false;
                            return true;
                        })
                        .map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    )}
                                >
                                    <Icon className={cn('w-5 h-5', active ? 'text-indigo-600' : 'text-gray-400')} />
                                    {item.label}
                                </Link>
                            );
                        })}
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-gray-100" />

                {/* External Links */}
                <a
                    href="http://localhost:8081"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                    <Smartphone className="w-5 h-5" />
                    Apri App Studenti
                    <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
            </nav>

            {/* User Profile */}
            {instructor && (
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                            {instructor.name
                                ?.split(' ')
                                .slice(0, 2)
                                .map(n => n[0])
                                .join('') || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {instructor.name}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                                {instructor.role === 'owner' ? 'Proprietario' :
                                    instructor.role === 'admin' ? 'Amministratore' : 'Istruttore'}
                            </p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Esci"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
}
