'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Player } from '@/types';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface PlayerManagementProps {
    players: Player[];
    onAddPlayer: (player: Omit<Player, 'id'>) => void;
    onUpdatePlayer: (player: Player) => void;
    onDeletePlayer: (playerId: number) => void;
}

export function PlayerManagement({ players, onAddPlayer, onUpdatePlayer, onDeletePlayer }: PlayerManagementProps) {
    const [newPlayerName, setNewPlayerName] = useState('');
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

    const handleAddPlayer = () => {
        onAddPlayer({ name: newPlayerName.trim() });
        setNewPlayerName('');
    };

    const handleUpdatePlayer = () => {
        if (!editingPlayer || !editingPlayer.name.trim()) {
            return;
        }

        onUpdatePlayer(editingPlayer);
        setEditingPlayer(null);
    };

    const handleDeletePlayer = (player: Player) => {
        onDeletePlayer(player.id);
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ajouter un joueur</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input placeholder="Nom du joueur" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} />
                        </div>
                        <Button onClick={handleAddPlayer}>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Joueurs</CardTitle>
                </CardHeader>
                <CardContent>
                    {players.length === 0 ? (
                        <p className="text-muted-foreground py-4 text-center">Aucun joueur enregistré</p>
                    ) : (
                        <div className="space-y-3">
                            {players.map((player) => (
                                <div key={player.id} className="flex items-center justify-between rounded-lg border p-3">
                                    {editingPlayer && editingPlayer.id === player.id ? (
                                        <div className="flex flex-1 gap-2">
                                            <Input
                                                value={editingPlayer.name}
                                                onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                                                autoFocus
                                            />
                                            <Button size="sm" onClick={handleUpdatePlayer}>
                                                Sauvegarder
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setEditingPlayer(null)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center">
                                                <Avatar className="mr-3 h-10 w-10">
                                                    <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{player.name}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => setEditingPlayer(player)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDeletePlayer(player)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
