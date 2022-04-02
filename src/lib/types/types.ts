export interface IMatch {
    demoName: string;
    map: string;
    rounds: IRound[];
    errorMessage?: string;
}

export interface IRound {
    roundNumber: number;
    highlights: IHighlight[];
}

export interface IHighlight {
    player: string;
    team: string;
    fragType: string;
    fragCategory: IFragCategory;
    clutchOpponents?: number;
    isAntieco: boolean;
    allKillsThatRoundForPlayer: IKill[];
}

export interface IKill {
    tick: number;
    time: number;
    weaponType: number;
    weaponName: string;
    isHeadshot: boolean;
    killedPlayerSteamId: Steamid;
}

//TODO Partial i get-frags
export interface IRoundKillPlayerSingle {
    steamid: Steamid;
    killerName: string;
    killerTeam: string;
    allKillsThatRoundForPlayer: IKill[];
}

export interface IClutch {
    playerSteamid: Steamid;
    opponentCount: number;
    roundNumber: number;
}

export type IFragCategory = 1 | 2 | 3;

type Steamid = string;

//TODO: FragtypeDetails
