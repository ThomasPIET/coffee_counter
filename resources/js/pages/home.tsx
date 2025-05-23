'use client';

import { Dashboard } from '@/components/dashboard';
import { GameForm } from '@/components/game-form';
import { GameHistory } from '@/components/game-history';
import { Header } from '@/components/header';
import { PlayerManagement } from '@/components/player-management';
import type { Game, Player } from '@/types';
import { useState } from 'react';

type Page = 'dashboard' | 'add-game' | 'history' | 'players';

export default function Home() {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [players, setPlayers] = useState<Player[]>([
        { id: 1, name: 'Joueur A' },
        { id: 2, name: 'Joueur B' },
        { id: 3, name: 'Joueur C' },
    ]);

    const [games, setGames] = useState<Game[]>([]);

    const addGame = (game: Game) => {
        setGames((prevGames) => [...prevGames, { ...game, id: prevGames.length + 1, date: new Date() }]);
        setCurrentPage('dashboard');
    };

    const addPlayer = (player: Omit<Player, 'id'>) => {
        setPlayers((prevPlayers) => [...prevPlayers, { ...player, id: prevPlayers.length > 0 ? Math.max(...prevPlayers.map((p) => p.id)) + 1 : 1 }]);
    };

    const updatePlayer = (updatedPlayer: Player) => {
        setPlayers((prevPlayers) => prevPlayers.map((player) => (player.id === updatedPlayer.id ? updatedPlayer : player)));
    };

    const deletePlayer = (playerId: number) => {
        setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId));
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
                return <PlayerManagement players={players} onAddPlayer={addPlayer} onUpdatePlayer={updatePlayer} onDeletePlayer={deletePlayer} />;
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
