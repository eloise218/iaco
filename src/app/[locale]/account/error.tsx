'use client';

import Link from 'next/link';

export default function AccountError({ reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="max-w-md text-center space-y-6">
                <h1 className="text-2xl font-bold text-white">
                    Une erreur est survenue
                </h1>
                <p className="text-slate-400">
                    Impossible de charger les paramètres. Réessaie ou retourne au tableau de bord.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors"
                    >
                        Réessayer
                    </button>
                    <Link
                        href="/dashboard"
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors"
                    >
                        Tableau de bord
                    </Link>
                </div>
            </div>
        </div>
    );
}
