export interface Player {
    id: number;
    name: string;
}

export interface Game {
    id?: number;
    date?: string;
    coffee_count: number;
    players: number[];
    damage_loser_id: number | null;
    concept_loser_id: number;
    damageLoserId?: number | null;
    conceptLoserId?: number;
    coffeeCount?: number;
}

export interface DebtSummary {
    from: Player;
    to: Player;
    coffeeCount: number;
}
