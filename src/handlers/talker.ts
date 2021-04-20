import express from 'express';
import {User} from '../helpers/unprocessed/dummy';
import World from '../helpers/unprocessed/opensys';
import {handleEvents} from '../helpers/unprocessed/tk';
import {
    ActionResponse,
    performAction,
} from '../helpers/actions';
import {userInput} from '../helpers/messageProcessor';
import {
    GameResponse,
    successResponse,
} from '../helpers/responses';
import Messages from '../models/messages';
import {
    Player,
} from '../models/player';

// TODO: Remove it
const getMessages = async (): Promise<any> => ({
    dirty: false,
    messages: '',
});

const CONVERSATION_MODE_NORMAL = 'MODE_0';
const CONVERSATION_MODE_CHAT = 'MODE_1';
const CONVERSATION_MODE_SYSTEM = 'MODE_2';

interface GameParams {
    action: string;
    conversationMode: string;
}

export const beforeTalker = (params: GameParams): GameParams => {
    const {
        action,
        conversationMode,
    } = params;
    if ((action === '**') && (conversationMode !== CONVERSATION_MODE_NORMAL)) {
        return {
            action: '',
            conversationMode: CONVERSATION_MODE_NORMAL,
        };
    }
    return params;
};

const applyConversation = (action: string, conversationMode: string): string => {
    if (!action) {
        return '';
    } else if ((action !== '*') && (action[0] === '*')) {
        return action.substr(1);
    } else if (conversationMode === CONVERSATION_MODE_SYSTEM) {
        return `tss ${action}`;
    } else if (conversationMode === CONVERSATION_MODE_CHAT) {
        return `say ${action}`;
    } else {
        return action;
    }
}

const getPrompt = (mode: string, visible: number, debugMode: boolean, level: number): string => {
    const conversationPrompt: { [k: string]: string } = {
        [CONVERSATION_MODE_NORMAL]: '>',
        [CONVERSATION_MODE_CHAT]: '"',
        [CONVERSATION_MODE_SYSTEM]: '*',
    }
    const prompt: string = (debugMode ? '#' : '')
        + ((level > 9) ? '----' : '')
        + (conversationPrompt[mode] || '?');
    return visible ? `(${prompt})` : prompt;
};

const getTitle = (player: Player): string => {
    if (player.visible > 9999) {
        return '-csh';
    } else if (player.visible === 0) {
        return `   --}----- ABERMUD -----{--     Playing as ${player.name}`;
    } else {
        return '';
    }
};

const talkerBefore = async (req: express.Request, res: express.Response) => {
    const {
        conversationMode,
        mode,
        title,
    } = req.params;

    const user: User = {
        userId: '',
        active: true,
        eventId: -1,
        locationId: 0,
        mode,
        name: '',
        playerId: 0,
    };
    const world = await World.load();
    const debugMode = false;
    const level = 0;

    const messages = await getMessages();
    const responseData: GameResponse = await successResponse(
        messages.messages,
        {
            deactivate: false,
            dirty: messages.dirty,
            keyboard: false,
            reprint: false,
        },
    );

    // Bottom

    const player = await world.getPlayer(user.playerId);
    await world.save();

    responseData.prompt = getPrompt(conversationMode, player.visible, debugMode, level);
    responseData.title = getTitle(player) || title;
    return responseData;
}

export const talker = async (req: express.Request, res: express.Response) => {
    const {
        action, // await keyInput(prompt, 80);
        conversationMode,
    } = req.params;

    const user: User = {
        userId: '',
        active: true,
        eventId: -1,
        locationId: 0,
        mode: '',
        name: '',
        playerId: 0,
    };
    const world = await World.load();
    const fight = {
        fighting: -1,
        inFight: 0,
    };

    // Top
    await Messages.addUserMessage(user, userInput(action));
    const converted = applyConversation(action, conversationMode);

    const messages: string[] = [];

    const eventMessages = await handleEvents(user, true);
    messages.push(eventMessages.join('\n'));

    const actionResult: ActionResponse = await performAction(converted, user);
    messages.push(actionResult.messages.join('\n'));
    let newEvents = actionResult.newEvents;
    const specialUser = actionResult.user;

    if (fight.fighting) {
        const player = await world.getPlayer(fight.fighting);
        if (!player || !player.name || (player.locationId !== specialUser.locationId)) {
            fight.inFight = 0;
            fight.fighting = -1;
        } else {
            fight.inFight -= 1;
        }
    }

    if (newEvents) {
        const eventMessages = await handleEvents(specialUser, true);
        messages.push(eventMessages.join('\n'));
        newEvents = false;
    }

    const userMessages = await getMessages();
    messages.push(userMessages.messages);
    const responseData: GameResponse = await successResponse(
        messages.join('\n'),
        {
            deactivate: true,
            dirty: userMessages.dirty,
            keyboard: true,
            // reprint: false,
        },
    );
    return res.json(responseData);
};

export default talker;
