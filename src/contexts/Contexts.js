import { createContext } from 'react';

export const WebsocketContext = createContext(false, () => { }, () => { }, false, 0); // ready, sendData, getData, waitingToReconnect, timeout
