'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@phosphor-icons/react';

export function BackButton({ label }: { label: string }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
            <ArrowLeftIcon className="w-4 h-4" />
            {label}
        </button>
    );
}
