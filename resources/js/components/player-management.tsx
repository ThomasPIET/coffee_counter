'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Player } from '@/types';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PlayerManagement() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/users')
            .then((r) => r.json())
            .then((data) => {
                setPlayers(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Failed to fetch players:', error);
                setIsLoading(false);
            });
    }, []);

    const handleAddPlayer = async () => {
        const name = newPlayerName.trim();
        if (!name) return;

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const json = await response.json();

            const newPlayer = json.user ?? json;
            setPlayers((prev) => [...prev, newPlayer]);
            setNewPlayerName('');
        } catch (err) {
            console.error('add player failed:', err);
        }
    };

    const handleUpdatePlayer = async () => {
        if (!editingPlayer || !editingPlayer.name.trim()) return;

        try {
            const response = await fetch(`/api/users/${editingPlayer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: editingPlayer.name.trim() }),
            });

            if (!response.ok) throw new Error('Failed to update player');

            setPlayers((prev) => prev.map((p) => (p.id === editingPlayer.id ? { ...p, name: editingPlayer.name } : p)));
            setEditingPlayer(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeletePlayer = async (player: Player) => {
        try {
            const response = await fetch(`/api/users/${player.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete player');

            setPlayers((prev) => prev.filter((p) => p.id !== player.id));
        } catch (error) {
            console.error(error);
        }
    };

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();

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
                    {isLoading ? (
                        <p className="py-4 text-center">Chargement...</p>
                    ) : players.length === 0 ? (
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
