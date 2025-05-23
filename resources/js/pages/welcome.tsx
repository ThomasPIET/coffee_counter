"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dashboard } from "@/components/dashboard"
import { GameForm } from "@/components/game-form"
import { GameHistory } from '@/components/game-history'
import type { Player, Game } from '@/types'

export default function Home() {
    const [players] = useState<Player[]>([
        { id: 1, name: "Thomas" },
        { id: 2, name: "Rodolphe" },
        { id: 3, name: "Ariel" },
    ])

    const [games, setGames] = useState<Game[]>([])

    const addGame = (game: Game) => {
        setGames((prevGames) => [...prevGames, { ...game, id: prevGames.length + 1, date: new Date() }])
    }

    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Compteur de Café</h1>

                <Tabs defaultValue="dashboard" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="dashboard">Bilan</TabsTrigger>
                        <TabsTrigger value="add-game">Ajouter une partie</TabsTrigger>
                        <TabsTrigger value="history">Historique</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard">
                        <Dashboard players={players} games={games} />
                    </TabsContent>

                    <TabsContent value="add-game">
                        <GameForm players={players} onAddGame={addGame} />
                    </TabsContent>

                    <TabsContent value="history">
                        <GameHistory games={games} players={players} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}
