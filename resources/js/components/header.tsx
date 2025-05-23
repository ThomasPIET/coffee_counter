'use client';

import { Button } from '@/components/ui/button';
import { BarChart3, Coffee, Menu, Plus, Users, X } from 'lucide-react';
import { useState } from 'react';

type Page = 'dashboard' | 'add-game' | 'history' | 'players';

interface HeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigationItems = [
        { id: 'dashboard' as Page, label: 'Tableau de bord', icon: BarChart3 },
        { id: 'add-game' as Page, label: 'Nouvelle partie', icon: Plus },
        { id: 'history' as Page, label: 'Historique', icon: Coffee },
        { id: 'players' as Page, label: 'Joueurs', icon: Users },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <button onClick={() => onNavigate('dashboard')} className="flex items-center space-x-2">
                        <div>
                            <Coffee className="h-8 w-8 text-amber-600" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Compteur Café</h1>
                    </button>

                    <nav className="hidden space-x-4 md:flex">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Button
                                    key={item.id}
                                    variant={currentPage === item.id ? 'default' : 'ghost'}
                                    onClick={() => onNavigate(item.id)}
                                    className="flex items-center space-x-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Button>
                            );
                        })}
                    </nav>

                    <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>

                {mobileMenuOpen && (
                    <div className="border-t border-gray-200 py-4 md:hidden">
                        <nav className="flex flex-col space-y-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Button
                                        key={item.id}
                                        variant={currentPage === item.id ? 'default' : 'ghost'}
                                        onClick={() => {
                                            onNavigate(item.id);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex w-full items-center justify-start space-x-2"
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Button>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
