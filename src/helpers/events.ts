// TODO: Remove it
const sendsys = async (
    receiver: string,
    sender: string,
    code: number,
    channelId: number,
    payload: any,
) => Promise.resolve();

const EVENT_STOP_SNOOP = 400;
const EVENT_START_SNOOP = 401;

export const sendStopSnoopEvent = (user: string, target: string) => sendsys(
    target,
    user,
    EVENT_STOP_SNOOP,
    0,
    null,
);

export const sendStartSnoopEvent = (user: string, target: string) => sendsys(
    target,
    user,
    EVENT_START_SNOOP,
    0,
    null,
);
