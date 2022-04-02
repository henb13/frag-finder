interface Match {
    demo: string;
    map: string;
    rounds: Round[];
    errorMessage?: string;
}

interface Round {
    roundNumber: number;
    highlights: Highlight[];
}

interface Highlight {
    player: string;
    team: string;
    fragType: string;
    fragCategory: 1 | 2 | 3;
    clutchOpponents?: number;
    antieco: boolean;
    allKillsThatRoundForPlayer: kill[];
}

interface kill {
    tick: number;
    time: number;
    weaponType: number;
    weaponName: string;
    isHeadshot: boolean;
    killedPlayerSteamId: string;
}

interface roundKillPerPlayerSingle {
    steamid: number;
    allKillsThatRoundForPlayer: kill[];
}

type Fragtype = "5k" | "4k" | "3k" | "2k" | "1k" | "clutch";

//TODO: FragtypeDetails
