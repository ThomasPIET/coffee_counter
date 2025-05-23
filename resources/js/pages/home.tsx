'use client';

import { Dashboard } from '@/components/dashboard';
import { GameForm } from '@/components/game-form';
import { GameHistory } from '@/components/game-history';
import { Header } from '@/components/header';
import PlayerManagement from '@/components/player-management';
import type { Game, Player } from '@/types';
import { useEffect, useState } from 'react';

type Page = 'dashboard' | 'add-game' | 'history' | 'players';

export default function Home() {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Failed to fetch players:', error);
                return [];
            }
        };

        fetchPlayers().then((data) => {
            setPlayers(data);
        });
    }, []);

    const [games, setGames] = useState<Game[]>([]);

    const addGame = (game: Game) => {
        setGames((prevGames) => [...prevGames, { ...game, id: prevGames.length + 1, date: new Date() }]);
        setCurrentPage('dashboard');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard players={players} games={games} onNavigateToAddGame={() => setCurrentPage('add-game')} />;
            case 'add-game':
                return <GameForm players={players} onAddGame={addGame} onCancel={() => setCurrentPage('dashboard')} />;
            case 'history':
                return <GameHistory games={games} players={players} />;
            case 'players':
                return <PlayerManagement />;
            default:
                return <Dashboard players={players} games={games} onNavigateToAddGame={() => setCurrentPage('add-game')} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header currentPage={currentPage} onNavigate={setCurrentPage} />
            <main className="container mx-auto px-4 py-8">{renderPage()}</main>
        </div>
    );
}
