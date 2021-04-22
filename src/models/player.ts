import {userCanSee} from '../helpers/unprocessed/weather';

export interface PlayerFlags {
    disableSnoop: boolean; // 6
    gender: string;
}

export const GENDER_NEUTRAL = 'NEUTRAL';
export const GENDER_MALE = 'MALE';
export const GENDER_FEMALE = 'FEMALE';

export interface Player {
    playerId: number;
    flags: PlayerFlags;
    level: number;
    locationId: number;
    name: string;
    visible: number;
    isMobile: boolean; // playerId > 15
    gender: string;
    // IT: player.isMobile && (['riatha', 'shazareth'].indexOf(player.name.toLowerCase()) >= 0)
    helping: number;
    strength: number;
    weapon: number;
}

export const canSeePlayer = async (user: Player | null, player: Player | null, isBlind: boolean): Promise<boolean> => {
    if (!user || !player) {
        return true;
    }
    if (player.playerId === user.playerId) {
        return true;
    }

    const canSee = !isBlind && await userCanSee(user);
    return canSee && (user.level >= player.visible);
}
