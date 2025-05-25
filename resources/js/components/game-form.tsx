'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import type { Game, Player } from '@/types';
import { useState } from 'react';

interface GameFormProps {
    players: Player[];
    onAddGame: (game: Game) => void;
    onCancel: () => void;
}

export function GameForm({ players, onAddGame, onCancel }: GameFormProps) {
    const [coffeeCount, setCoffeeCount] = useState<number>(1);
    const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
    const [damageLoserId, setDamageLoserId] = useState<number | null>(null);
    const [conceptLoserId, setConceptLoserId] = useState<number | null>(null);
    const [step, setStep] = useState<number>(1);

    const handlePlayerToggle = (playerId: number) => {
        if (selectedPlayers.includes(playerId)) {
            setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));

            if (damageLoserId === playerId) setDamageLoserId(null);
            if (conceptLoserId === playerId) setConceptLoserId(null);
        } else {
            setSelectedPlayers([...selectedPlayers, playerId]);
        }
    };

    const handleSubmit = async () => {
        if (damageLoserId === null) {
            alert('Veuillez sélectionner un joueur pour le perdant au dégâts');
            return;
        }

        if (conceptLoserId === null) {
            alert('Veuillez sélectionner un joueur pour le perdant au concept');
            return;
        }

        const sameLoser = damageLoserId === conceptLoserId;

        const newGame: Game = {
            coffee_count: coffeeCount,
            players: selectedPlayers,
            damage_loser_id: sameLoser ? null : damageLoserId,
            concept_loser_id: conceptLoserId,
            date: new Date().toISOString().split('T')[0],
        };

        console.log(JSON.stringify(newGame));

        try {
            const response = await fetch('/api/games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(newGame),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            
            const savedGame = await response.json();
            onAddGame(savedGame);
            
            setCoffeeCount(1);
            setSelectedPlayers([]);
            setDamageLoserId(null);
            setConceptLoserId(null);
            setStep(1);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la partie:", error);
            alert("Erreur lors de l'ajout de la partie. Veuillez réessayer.");
        }
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Ajouter une nouvelle partie</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6">
                    <div className="mb-2 flex justify-between">
                        <div className="flex space-x-2">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                1
                            </div>
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                2
                            </div>
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                    step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                3
                            </div>
                        </div>
                        <div className="text-muted-foreground text-sm">Étape {step} sur 3</div>
                    </div>
                    <div className="bg-muted mt-4 h-2 w-full rounded-full">
                        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }}></div>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Sélectionnez les joueurs</h3>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            {players.map((player) => (
                                <div
                                    key={player.id}
                                    className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
                                        selectedPlayers.includes(player.id) ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                                    }`}
                                    onClick={() => handlePlayerToggle(player.id)}
                                >
                                    <Avatar className="mr-3 h-10 w-10">
                                        <AvatarFallback className={selectedPlayers.includes(player.id) ? 'bg-primary text-primary-foreground' : ''}>
                                            {getInitials(player.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{player.name}</span>
                                </div>
                            ))}
                        </div>
                        {selectedPlayers.length > 0 && (
                            <div className="mt-4">
                                <h4 className="mb-2 text-sm font-medium">Joueurs sélectionnés:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPlayers.map((id) => {
                                        const player = players.find((p) => p.id === id);
                                        return player ? (
                                            <Badge key={id} variant="secondary" className="py-1 text-sm">
                                                {player.name}
                                            </Badge>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium">Nombre de cafés en jeu</h3>
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="text-5xl font-bold">{coffeeCount}</div>
                            </div>
                            <div className="px-4">
                                <Slider value={[coffeeCount]} min={1} max={15} step={1} onValueChange={(value) => setCoffeeCount(value[0])} />
                            </div>
                            <div className="text-muted-foreground flex justify-between px-4 text-sm">
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                                <span>6</span>
                                <span>7</span>
                                <span>8</span>
                                <span>9</span>
                                <span>10</span>
                                <span>11</span>
                                <span>12</span>
                                <span>13</span>
                                <span>14</span>
                                <span>15</span>
                            </div>
                            <p className="text-muted-foreground mt-4 text-center text-sm">
                                Le perdant au concept devra {coffeeCount} café{coffeeCount > 1 ? 's' : ''} à chaque autre joueur
                            </p>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Qui a perdu aux dégâts? (1 café)</h3>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                {selectedPlayers.map((playerId) => {
                                    const player = players.find((p) => p.id === playerId);
                                    return player ? (
                                        <div
                                            key={player.id}
                                            className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
                                                damageLoserId === player.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                                            }`}
                                            onClick={() => setDamageLoserId(player.id)}
                                        >
                                            <Avatar className="mr-3 h-10 w-10">
                                                <AvatarFallback className={damageLoserId === player.id ? 'bg-primary text-primary-foreground' : ''}>
                                                    {getInitials(player.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{player.name}</span>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <h3 className="text-lg font-medium">
                                Qui a perdu au concept? ({coffeeCount} café{coffeeCount > 1 ? 's' : ''})
                            </h3>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                {selectedPlayers.map((playerId) => {
                                    const player = players.find((p) => p.id === playerId);
                                    return player ? (
                                        <div
                                            key={player.id}
                                            className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
                                                conceptLoserId === player.id
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                            onClick={() => setConceptLoserId(player.id)}
                                        >
                                            <Avatar className="mr-3 h-10 w-10">
                                                <AvatarFallback className={conceptLoserId === player.id ? 'bg-primary text-primary-foreground' : ''}>
                                                    {getInitials(player.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{player.name}</span>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                {step > 1 ? (
                    <Button variant="outline" onClick={prevStep}>
                        Précédent
                    </Button>
                ) : (
                    <Button variant="outline" onClick={onCancel}>
                        Annuler
                    </Button>
                )}
                {step < 3 ? (
                    <Button onClick={nextStep} disabled={selectedPlayers.length < 2}>
                        Suivant
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={conceptLoserId === null || damageLoserId === null}>
                        Ajouter la partie
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
