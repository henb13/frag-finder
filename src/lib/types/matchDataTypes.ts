export interface IMatchDataKill {
    round_number: number;
    killer_steamid: string;
    killer_name: string;
    killer_side: "CT" | "T";
    killed_steamid: string;
    killed_name: string;
    killed_side: "CT" | "T";
    weapon: {
        element: number;
        type: number;
        weapon_name: string;
    };
    has_won: boolean;
    has_won_round: boolean;
    tick: number;
    seconds: number;
}

export interface IMatchDataClutch {
    opponent_count: number;
    has_won: boolean;
    round_number: number;
    tick: number;
    seconds: number;
}
