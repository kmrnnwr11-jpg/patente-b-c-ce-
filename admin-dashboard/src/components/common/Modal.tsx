'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative z-10 max-h-[90vh] overflow-auto rounded-xl bg-white shadow-xl',
                    size === 'sm' && 'w-full max-w-sm',
                    size === 'md' && 'w-full max-w-md',
                    size === 'lg' && 'w-full max-w-lg',
                    size === 'xl' && 'w-full max-w-xl'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
