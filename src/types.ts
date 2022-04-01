interface Round {
    roundNumber: number;
    highlights: Highlight[];
}

interface Highlight {
    player: string;
    steamId: string;
    team: string;
    fragType: string;
    fragCategory: 1 | 2 | 3;
    antieco: boolean;
    individualKills: RoundKill[];
}

interface RoundKill {
    killerName: string;
    killerTeam: string;
    tick: number;
    time: number;
    weaponType: number;
    weaponName: string;
    isHeadshot: boolean;
    killedPlayerSteamId: string;
}
