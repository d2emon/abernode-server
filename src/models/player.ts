const isdark = (): boolean => false;

export interface PlayerFlags {
    disableSnoop: boolean; // 6
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
}

export const canSeePlayer = (user: Player | null, player: Player | null, isBlind: boolean): boolean => {
    if (!user || !player) {
        return true;
    }
    if (player.playerId === user.playerId) {
        return true;
    }
    if (isBlind) {
        return false;
    }
    if ((user.locationId === player.locationId) && isdark()) {
        return false;
    }
    return (user.level >= player.visible);
}
