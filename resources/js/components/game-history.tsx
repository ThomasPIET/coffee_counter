'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Game, Player } from '@/types';

interface GameHistoryProps {
    games: Game[];
    players: Player[];
}

export function GameHistory({ games, players }: GameHistoryProps) {
    const getPlayerName = (playerId: number) => {
        const player = players.find((p) => p.id === playerId);
        return player ? player.name : 'Joueur inconnu';
    };

    const formatDate = (date?: string | Date) => {
        if (!date) return 'Date inconnue';
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return 'Date inconnue';
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(dateObj);
    };

    const sortedGames = [...games].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <Card>
            <CardHeader>
                <CardTitle>Historique des parties</CardTitle>
            </CardHeader>
            <CardContent>
                {sortedGames.length === 0 ? (
                    <p className="text-muted-foreground text-center">Aucune partie enregistrée</p>
                ) : (
                    <div className="space-y-4">
                        {sortedGames.map((game, index) => (
                            <Card key={index} className="overflow-hidden">
                                <div className="bg-muted p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">Partie #{game.id}</h3>
                                        <span className="text-muted-foreground text-sm">{formatDate(game.date)}</span>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-muted-foreground text-sm">Joueurs:</span>
                                                <div className="font-medium">
                                                    {game.players.map((playerId) => getPlayerName(playerId)).join(', ')}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground text-sm">Cafés en jeu:</span>
                                                <div className="font-medium">{game.coffeeCount}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-muted-foreground text-sm">Perdant aux dégâts:</span>
                                                <div className="font-medium">{getPlayerName(game.damageLoserId)}</div>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground text-sm">Perdant au concept:</span>
                                                <div className="font-medium">{getPlayerName(game.conceptLoserId)}</div>
                                            </div>
                                        </div>

                                        <div className="mt-4 border-t pt-2">
                                            <span className="text-sm font-medium">Résultat:</span>
                                            <ul className="mt-1 space-y-1">
                                                {game.players.map((playerId) => {
                                                    if (playerId === game.damageLoserId && playerId === game.conceptLoserId) {
                                                        return (
                                                            <li key={playerId}>
                                                                <strong>{getPlayerName(playerId)}</strong> doit 1 café (dégâts) + {game.coffeeCount}{' '}
                                                                café{game.coffeeCount > 1 ? 's' : ''} (concept) à chaque joueur
                                                            </li>
                                                        );
                                                    } else if (playerId === game.damageLoserId) {
                                                        return (
                                                            <li key={playerId}>
                                                                <strong>{getPlayerName(playerId)}</strong> doit 1 café (dégâts) à chaque joueur
                                                            </li>
                                                        );
                                                    } else if (playerId === game.conceptLoserId) {
                                                        return (
                                                            <li key={playerId}>
                                                                <strong>{getPlayerName(playerId)}</strong> doit {game.coffeeCount} café
                                                                {game.coffeeCount > 1 ? 's' : ''} (concept) à chaque joueur
                                                            </li>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
