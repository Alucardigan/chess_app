import { createContext } from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface SocketContextValue {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    setSocket: any;
}
const SocketContext = createContext<SocketContextValue>({socket: io(),setSocket: ()=> {}});

export default SocketContext;