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
        const fetchData = async () => {
            try {
                // Fetch players
                const playersResponse = await fetch('/api/users');
                if (!playersResponse.ok) throw new Error(`HTTP ${playersResponse.status}`);
                const playersData = await playersResponse.json();
                setPlayers(playersData);
                
                // Fetch games
                const gamesResponse = await fetch('/api/games');
                if (!gamesResponse.ok) throw new Error(`HTTP ${gamesResponse.status}`);
                const gamesData = await gamesResponse.json();
                
                // Transform the data to match our frontend structure
                const formattedGames = gamesData.map((game: any) => ({
                    id: game.id,
                    date: game.date,
                    coffee_count: game.coffee_count,
                    coffeeCount: game.coffee_count, // For backward compatibility
                    damage_loser_id: game.damage_loser_id,
                    damageLoserId: game.damage_loser_id, // For backward compatibility
                    concept_loser_id: game.concept_loser_id,
                    conceptLoserId: game.concept_loser_id, // For backward compatibility
                    players: game.players.map((player: any) => player.id)
                }));
                
                setGames(formattedGames);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);

    const [games, setGames] = useState<Game[]>([]);

    const addGame = (game: Game) => {
        // The game is already saved to the database by the GameForm component
        // Here we just update our local state
        setGames((prevGames) => [...prevGames, game]);
        setCurrentPage('dashboard');
    };

    const reduceDebt = async (fromPlayerId: number, toPlayerId: number) => {
        try {
            const response = await fetch('/api/games/reduce-debt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    from_player_id: fromPlayerId,
                    to_player_id: toPlayerId,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            // Refresh games data to reflect the debt reduction
            const gamesResponse = await fetch('/api/games');
            if (!gamesResponse.ok) throw new Error(`HTTP ${gamesResponse.status}`);
            const gamesData = await gamesResponse.json();
            
            const formattedGames = gamesData.map((game: any) => ({
                id: game.id,
                date: game.date,
                coffee_count: game.coffee_count,
                coffeeCount: game.coffee_count,
                damage_loser_id: game.damage_loser_id,
                damageLoserId: game.damage_loser_id,
                concept_loser_id: game.concept_loser_id,
                conceptLoserId: game.concept_loser_id,
                players: game.players.map((player: any) => player.id)
            }));
            
            setGames(formattedGames);
        } catch (error) {
            console.error('Failed to reduce debt:', error);
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard players={players} games={games} onNavigateToAddGame={() => setCurrentPage('add-game')} onReduceDebt={reduceDebt} />;
            case 'add-game':
                return <GameForm players={players} onAddGame={addGame} onCancel={() => setCurrentPage('dashboard')} />;
            case 'history':
                return <GameHistory games={games} players={players} />;
            case 'players':
                return <PlayerManagement />;
            default:
                return <Dashboard players={players} games={games} onNavigateToAddGame={() => setCurrentPage('add-game')} onReduceDebt={reduceDebt} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header currentPage={currentPage} onNavigate={setCurrentPage} />
            <main className="container mx-auto px-4 py-8">{renderPage()}</main>
        </div>
    );
}
