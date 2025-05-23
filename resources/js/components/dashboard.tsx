'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DebtSummary, Game, Player } from '@/types';
import { Coffee, Plus, TrendingUp, Users } from 'lucide-react';
import { useMemo } from 'react';

interface DashboardProps {
    players: Player[];
    games: Game[];
    onNavigateToAddGame: () => void;
}

export function Dashboard({ players, games, onNavigateToAddGame }: DashboardProps) {
    const debtSummary = useMemo(() => {
        const debts: DebtSummary[] = [];

        games.forEach((game) => {
            const damageLoserId = game.damageLoserId;
            const conceptLoserId = game.conceptLoserId;

            game.players.forEach((playerId) => {
                if (playerId !== damageLoserId) {
                    const from = players.find((p) => p.id === damageLoserId);
                    const to = players.find((p) => p.id === playerId);

                    if (from && to) {
                        const existingDebt = debts.find((d) => d.from.id === from.id && d.to.id === to.id);

                        if (existingDebt) {
                            existingDebt.coffeeCount += 1;
                        } else {
                            debts.push({ from, to, coffeeCount: 1 });
                        }
                    }
                }
            });

            game.players.forEach((playerId) => {
                if (playerId !== conceptLoserId) {
                    const from = players.find((p) => p.id === conceptLoserId);
                    const to = players.find((p) => p.id === playerId);

                    if (from && to) {
                        const existingDebt = debts.find((d) => d.from.id === from.id && d.to.id === to.id);

                        if (existingDebt) {
                            existingDebt.coffeeCount += game.coffeeCount;
                        } else {
                            debts.push({ from, to, coffeeCount: game.coffeeCount });
                        }
                    }
                }
            });
        });

        const consolidatedDebts: DebtSummary[] = [];

        debts.forEach((debt) => {
            const oppositeDebt = debts.find((d) => d.from.id === debt.to.id && d.to.id === debt.from.id);

            if (oppositeDebt) {
                if (debt.coffeeCount > oppositeDebt.coffeeCount) {
                    const existingConsolidatedDebt = consolidatedDebts.find((d) => d.from.id === debt.from.id && d.to.id === debt.to.id);

                    if (!existingConsolidatedDebt) {
                        consolidatedDebts.push({
                            from: debt.from,
                            to: debt.to,
                            coffeeCount: debt.coffeeCount - oppositeDebt.coffeeCount,
                        });
                    }
                }
            } else {
                const existingConsolidatedDebt = consolidatedDebts.find((d) => d.from.id === debt.from.id && d.to.id === debt.to.id);

                if (!existingConsolidatedDebt) {
                    consolidatedDebts.push(debt);
                }
            }
        });

        return consolidatedDebts.filter((d) => d.coffeeCount > 0);
    }, [games, players]);

    const totalCoffees = debtSummary.reduce((total, debt) => total + debt.coffeeCount, 0);

    return (
        <div className="space-y-8">
            <div className="space-y-4 text-center">
                <h1 className="text-4xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-lg text-gray-600">Suivez qui doit combien de cafés et à qui</p>
                <Button onClick={onNavigateToAddGame} size="lg" className="mt-4">
                    <Plus className="mr-2 h-5 w-5" />
                    Ajouter une partie
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total parties</CardTitle>
                        <TrendingUp className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{games.length}</div>
                        <p className="text-muted-foreground text-xs">parties jouées</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Joueurs actifs</CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{players.length}</div>
                        <p className="text-muted-foreground text-xs">joueurs enregistrés</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cafés en jeu</CardTitle>
                        <Coffee className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCoffees}</div>
                        <p className="text-muted-foreground text-xs">cafés à payer</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Bilan des cafés</CardTitle>
                </CardHeader>
                <CardContent>
                    {debtSummary.length === 0 ? (
                        <div className="py-12 text-center">
                            <Coffee className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                            <p className="mb-2 text-lg text-gray-600">Aucune dette de café pour le moment</p>
                            <p className="mb-4 text-gray-500">Commencez par ajouter une partie !</p>
                            <Button onClick={onNavigateToAddGame}>
                                <Plus className="mr-2 h-4 w-4" />
                                Ajouter une partie
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {debtSummary.map((debt, index) => (
                                <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                            <Coffee className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <span className="text-red-600">{debt.from.name}</span> doit{' '}
                                                <span className="text-lg font-bold">{debt.coffeeCount}</span>{' '}
                                                {debt.coffeeCount > 1 ? 'cafés' : 'café'} à <span className="text-green-600">{debt.to.name}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Statistiques par joueur</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {players.map((player) => {
                            const owes = debtSummary
                                .filter((debt) => debt.from.id === player.id)
                                .reduce((total, debt) => total + debt.coffeeCount, 0);

                            const owed = debtSummary.filter((debt) => debt.to.id === player.id).reduce((total, debt) => total + debt.coffeeCount, 0);

                            const balance = owed - owes;

                            return (
                                <Card key={player.id} className="border-l-4 border-l-amber-500">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">{player.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Doit:</span>
                                            <span className="font-medium text-red-600">
                                                {owes} {owes > 1 ? 'cafés' : 'café'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Reçoit:</span>
                                            <span className="font-medium text-green-600">
                                                {owed} {owed > 1 ? 'cafés' : 'café'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 text-sm">
                                            <span className="font-medium">Bilan:</span>
                                            <span
                                                className={`font-bold ${
                                                    balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-gray-600'
                                                }`}
                                            >
                                                {balance > 0 ? '+' : ''}
                                                {balance} {Math.abs(balance) > 1 ? 'cafés' : 'café'}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
