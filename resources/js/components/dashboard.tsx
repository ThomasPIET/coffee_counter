"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Player, Game, DebtSummary } from "@/types"

interface DashboardProps {
    players: Player[]
    games: Game[]
}

export function Dashboard({ players, games }: DashboardProps) {
    const debtSummary = useMemo(() => {
        const debts: DebtSummary[] = []

        // Calculate debts from all games
        games.forEach((game) => {
            const damageLoserId = game.damageLoserId
            const conceptLoserId = game.conceptLoserId

            // Process damage loser (always owes 1 coffee to each player)
            game.players.forEach((playerId) => {
                if (playerId !== damageLoserId) {
                    const from = players.find((p) => p.id === damageLoserId)
                    const to = players.find((p) => p.id === playerId)

                    if (from && to) {
                        const existingDebt = debts.find((d) => d.from.id === from.id && d.to.id === to.id)

                        if (existingDebt) {
                            existingDebt.coffeeCount += 1
                        } else {
                            debts.push({ from, to, coffeeCount: 1 })
                        }
                    }
                }
            })

            // Process concept loser (owes game.coffeeCount coffees to each player)
            game.players.forEach((playerId) => {
                if (playerId !== conceptLoserId) {
                    const from = players.find((p) => p.id === conceptLoserId)
                    const to = players.find((p) => p.id === playerId)

                    if (from && to) {
                        const existingDebt = debts.find((d) => d.from.id === from.id && d.to.id === to.id)

                        if (existingDebt) {
                            existingDebt.coffeeCount += game.coffeeCount
                        } else {
                            debts.push({ from, to, coffeeCount: game.coffeeCount })
                        }
                    }
                }
            })
        })

        // Consolidate debts (if A owes B 2 coffees and B owes A 1 coffee, then A owes B 1 coffee)
        const consolidatedDebts: DebtSummary[] = []

        debts.forEach((debt) => {
            const oppositeDebt = debts.find((d) => d.from.id === debt.to.id && d.to.id === debt.from.id)

            if (oppositeDebt) {
                if (debt.coffeeCount > oppositeDebt.coffeeCount) {
                    const existingConsolidatedDebt = consolidatedDebts.find(
                        (d) => d.from.id === debt.from.id && d.to.id === debt.to.id,
                    )

                    if (!existingConsolidatedDebt) {
                        consolidatedDebts.push({
                            from: debt.from,
                            to: debt.to,
                            coffeeCount: debt.coffeeCount - oppositeDebt.coffeeCount,
                        })
                    }
                }
            } else {
                const existingConsolidatedDebt = consolidatedDebts.find(
                    (d) => d.from.id === debt.from.id && d.to.id === debt.to.id,
                )

                if (!existingConsolidatedDebt) {
                    consolidatedDebts.push(debt)
                }
            }
        })

        return consolidatedDebts.filter((d) => d.coffeeCount > 0)
    }, [games, players])

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Bilan des cafés</CardTitle>
                </CardHeader>
                <CardContent>
                    {debtSummary.length === 0 ? (
                        <p className="text-center text-muted-foreground">Aucune dette de café pour le moment</p>
                    ) : (
                        <div className="space-y-4">
                            {debtSummary.map((debt, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{debt.from.name}</span>
                                        <span>doit</span>
                                        <span className="font-bold text-lg">{debt.coffeeCount}</span>
                                        <span>{debt.coffeeCount > 1 ? "cafés" : "café"}</span>
                                        <span>à</span>
                                        <span className="font-medium">{debt.to.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {players.map((player) => {
                            const owes = debtSummary
                                .filter((debt) => debt.from.id === player.id)
                                .reduce((total, debt) => total + debt.coffeeCount, 0)

                            const owed = debtSummary
                                .filter((debt) => debt.to.id === player.id)
                                .reduce((total, debt) => total + debt.coffeeCount, 0)

                            return (
                                <Card key={player.id}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{player.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Doit:</span>
                                                <span className="font-medium">
                          {owes} {owes > 1 ? "cafés" : "café"}
                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Reçoit:</span>
                                                <span className="font-medium">
                          {owed} {owed > 1 ? "cafés" : "café"}
                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Bilan:</span>
                                                <span
                                                    className={`font-bold ${owed - owes > 0 ? "text-green-600" : owed - owes < 0 ? "text-red-600" : ""}`}
                                                >
                          {owed - owes > 0 ? "+" : ""}
                                                    {owed - owes} {Math.abs(owed - owes) > 1 ? "cafés" : "café"}
                        </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
