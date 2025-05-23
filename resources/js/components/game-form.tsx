"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Player, Game } from "@/types"
import { toast } from "@/components/ui/use-toast"

interface GameFormProps {
    players: Player[]
    onAddGame: (game: Game) => void
}

export function GameForm({ players, onAddGame }: GameFormProps) {
    const [coffeeCount, setCoffeeCount] = useState<number>(1)
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>([])
    const [damageLoserId, setDamageLoserId] = useState<number | null>(null)
    const [conceptLoserId, setConceptLoserId] = useState<number | null>(null)

    const handlePlayerToggle = (playerId: number) => {
        if (selectedPlayers.includes(playerId)) {
            setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId))

            // Reset loser selections if the player is deselected
            if (damageLoserId === playerId) setDamageLoserId(null)
            if (conceptLoserId === playerId) setConceptLoserId(null)
        } else {
            setSelectedPlayers([...selectedPlayers, playerId])
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (selectedPlayers.length < 2) {
            toast({
                title: "Erreur",
                description: "Sélectionnez au moins 2 joueurs pour une partie",
                variant: "destructive",
            })
            return
        }

        if (damageLoserId === null) {
            toast({
                title: "Erreur",
                description: "Sélectionnez le perdant aux dégâts",
                variant: "destructive",
            })
            return
        }

        if (conceptLoserId === null) {
            toast({
                title: "Erreur",
                description: "Sélectionnez le perdant au concept",
                variant: "destructive",
            })
            return
        }

        const newGame: Game = {
            coffeeCount,
            players: selectedPlayers,
            damageLoserId,
            conceptLoserId,
        }

        onAddGame(newGame)

        // Reset form
        setCoffeeCount(1)
        setSelectedPlayers([])
        setDamageLoserId(null)
        setConceptLoserId(null)

        toast({
            title: "Partie ajoutée",
            description: "La partie a été ajoutée avec succès",
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ajouter une nouvelle partie</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="coffeeCount">Nombre de cafés en jeu</Label>
                        <Input
                            id="coffeeCount"
                            type="number"
                            min="1"
                            value={coffeeCount}
                            onChange={(e) => setCoffeeCount(Number.parseInt(e.target.value))}
                            required
                        />
                        <p className="text-sm text-muted-foreground">
                            Le perdant au concept devra ce nombre de cafés à chaque autre joueur
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Joueurs participants</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {players.map((player) => (
                                <div key={player.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`player-${player.id}`}
                                        checked={selectedPlayers.includes(player.id)}
                                        onCheckedChange={() => handlePlayerToggle(player.id)}
                                    />
                                    <Label htmlFor={`player-${player.id}`}>{player.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="damageLoserId">Perdant aux dégâts (1 café)</Label>
                        <Select
                            value={damageLoserId?.toString() || ""}
                            onValueChange={(value) => setDamageLoserId(Number.parseInt(value))}
                            disabled={selectedPlayers.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner le perdant" />
                            </SelectTrigger>
                            <SelectContent>
                                {selectedPlayers.map((playerId) => {
                                    const player = players.find((p) => p.id === playerId)
                                    return player ? (
                                        <SelectItem key={player.id} value={player.id.toString()}>
                                            {player.name}
                                        </SelectItem>
                                    ) : null
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="conceptLoserId">
                            Perdant au concept ({coffeeCount} café{coffeeCount > 1 ? "s" : ""})
                        </Label>
                        <Select
                            value={conceptLoserId?.toString() || ""}
                            onValueChange={(value) => setConceptLoserId(Number.parseInt(value))}
                            disabled={selectedPlayers.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner le perdant" />
                            </SelectTrigger>
                            <SelectContent>
                                {selectedPlayers.map((playerId) => {
                                    const player = players.find((p) => p.id === playerId)
                                    return player ? (
                                        <SelectItem key={player.id} value={player.id.toString()}>
                                            {player.name}
                                        </SelectItem>
                                    ) : null
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">
                        Ajouter la partie
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
