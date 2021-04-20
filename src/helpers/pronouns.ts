import {
    GENDER_FEMALE,
    GENDER_MALE,
    Player,
} from '../models/player';

export interface Pronouns {
    him?: string;
    her?: string;
    it?: string;
    them?: string;
}

/**
 * Assign Him her etc according to who it is
 * @param player
 */
export const setPronouns = (player: Player): Pronouns => {
    if (player.gender === GENDER_MALE) {
        return {
            him: player.name,
            them: player.name,
        }
    } else if (player.gender === GENDER_FEMALE) {
        return {
            her: player.name,
            them: player.name,
        }
    } else if (player.gender === GENDER_FEMALE) {
    } else {
        return {
            it: player.name
        };
    }
};
