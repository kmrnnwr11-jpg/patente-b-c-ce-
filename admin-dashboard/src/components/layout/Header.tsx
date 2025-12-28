'use client';

import { Bell, Search, User } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
            {/* Search */}
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cerca utenti, promo codes..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative rounded-lg p-2 hover:bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {/* Admin Profile */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Admin</p>
                        <p className="text-xs text-gray-500">kmrnnwr11@gmail.com</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <User className="h-5 w-5 text-purple-600" />
                    </div>
                </div>
            </div>
        </header>
    );
}
