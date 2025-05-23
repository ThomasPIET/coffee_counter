export interface Player {
    id: number;
    name: string;
}

export interface Game {
    id?: number;
    date?: Date;
    coffeeCount: number;
    players: number[];
    damageLoserId: number;
    conceptLoserId: number;
}

export interface DebtSummary {
    from: Player;
    to: Player;
    coffeeCount: number;
}
