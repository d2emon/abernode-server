import {userCanSee} from '../helpers/unprocessed/weather';
import {EVENT_START} from '../helpers/unprocessed/dummy';

export const GENDER_NEUTRAL = 'NEUTRAL';
export const GENDER_MALE = 'MALE';
export const GENDER_FEMALE = 'FEMALE';

export interface PlayerFlags {
    gender: string;
    disableExorcise: boolean;
    canChangeFlags: boolean;
    canEdit: boolean;
    isDebugger: boolean;
    canUsePatch: boolean;
    disableSnoop: boolean;
}

interface PlayerData {
    playerId: number;

    name: string;

    locationId: number;
    eventId: number;
    // 6
    strength: number;

    visibility: number;
    flags: PlayerFlags;
    level: number;
    weaponId: number;

    // 12
    helping: number;
    // 14
    // 15
}

export class Player implements PlayerData {
    playerId: number;

    // From world

    name: string;

    locationId: number;

    eventId: number;

    strength: number;

    visibility: number;

    flags: PlayerFlags;

    level: number;

    weaponId: number;

    helping: number;

    constructor(playerId: number, name: string) {
        this.playerId = playerId;
        this.name = name;
        this.locationId = 0;
        this.eventId = EVENT_START;
        this.strength = -1;
        this.visibility = 0;
        this.flags = {
            gender: GENDER_NEUTRAL,
            disableExorcise: false,
            canChangeFlags: false,
            canEdit: false,
            isDebugger: false,
            canUsePatch: false,
            disableSnoop: false,
        }
        this.level = 1;
        this.weaponId = null;
        this.helping = null;
    }

    private fromWorld (player: PlayerData): void {
        this.name = player.name;
        this.locationId = player.locationId;
        this.eventId = player.eventId;
        this.strength = player.strength;
        this.visibility = player.visibility;
        this.flags = player.flags;
        this.level = player.level;
        this.weaponId = player.weaponId;
        this.helping = player.helping;
    }

    isMobile(): boolean {
        return this.playerId >= MAX_USERS;
    }

    getGender(): string {
        if (this.isMobile() && (['riatha', 'shazareth'].indexOf(this.name.toLowerCase()) >= 0)) {
            return GENDER_NEUTRAL;
        }
        return this.flags.gender;
    }

    isDisabled(): boolean {
        return this.eventId === undefined;
    }

    isAdmin(): boolean {
        return this.level >= 10;
    }

    isSuperuser(): boolean {
        return this.level >= 10000;
    }

    isDead(): boolean {
        return this.strength < 0;
    }

    async getHelper(players: PlayerData[]): Promise<Player> {
        const data: PlayerData = players
            .find((p:PlayerData) => ((p.locationId === this.locationId) && (player.helping === this.playerId)));

        if (!data) {
            return null;
        }

        const player = new Player(data.playerId, data.name)
        player.fromWorld(data);
        return player;
    }

    canSee(player: Player): boolean {
        if (!player) {
            return true;
        }
        if (this.playerId === player.playerId) {
            return true;
        }
        return this.level >= player.visibility;
    }
}

export const canSeePlayer = async (user: Player | null, player: Player | null, isBlind: boolean): Promise<boolean> => {
    if (!user || !player) {
        return true;
    }
    if (player.playerId === user.playerId) {
        return true;
    }

    const canSee = !isBlind && await userCanSee(user);
    return canSee && (user.level >= player.visibility);
}

