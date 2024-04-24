import React, { useEffect, useState, useRef } from 'react';
import { WebsocketContext } from '../contexts/Contexts';
import useTimeout from "../hooks/useTimeout";

const timeouts = [3000, 5000, 10000, 20000, 30000]

const WebsocketContainer = ({ children }) => {

    const [isReady, setIsReady] = useState(false);
    const isReadyRef = useRef(isReady)
    const ws = useRef(null)

    const [waitingToReconnect, setWaitingToReconnect] = useState(null);
    const timeout = useRef({
        index: 0,
        value: timeouts[0]
    })

    const [connectionTimeout] = useTimeout(() => {
        console.log("Connection timeout !")
        // if (!isReadyRef) {
        //     console.log("5 second timeout")
        //     console.log(isReady)
        //     ws.current.close()
        // }
    }, 5000)

    const [reconnectTimeout] = useTimeout(() => {
        setWaitingToReconnect(null);
        console.log("Reconnect after " + timeout.current.value + " secondes.")
    }, timeout.current.value)

    useEffect(() => {
        isReadyRef.current = isReady;
    }, [isReady])

    useEffect(() => {

        console.log(waitingToReconnect)

        if (waitingToReconnect) {
            return;
        }

        if (!ws.current) {
            console.log("Opening websocket connection");

            const socket = new WebSocket("ws://localhost:8080");
            ws.current = socket;

            // setTimeout(() => {
            //     if (!isReadyRef) {
            //         console.log("5 second timeout")
            //         console.log(isReady)
            //         socket.close()
            //     }
            // }, 5000)

            connectionTimeout()

            socket.onopen = () => {
                setIsReady(true)
                console.log("Connection opened on : " + Date.now())
                // socket.addEventListener("message", (event) => {
                //   console.log("Got datas : " + JSON.parse(event.data))
                // })
            }

            socket.onmessage = (event) => {
                console.log("Got datas : ")
                console.log(JSON.parse(event.data))
            }

            socket.onerror = (error) => console.error(error)

            socket.onclose = () => {
                if (!ws.current) {
                    console.log('WS closed by client, no attempt to reconnect.');
                    return;
                }

                if (waitingToReconnect) {
                    return;
                };

                console.log('WS closed by server, attempting to reconnect.');

                if (!timeout.current) {
                    timeout.current = {
                        index: 0,
                        value: timeouts[0]
                    }
                } else {
                    if (timeout.current.index !== timeouts.length - 1) {
                        timeout.current = {
                            index: timeout.current.index + 1,
                            value: timeouts[timeout.current.index + 1]
                        }
                    }
                }

                setIsReady(false);
                setWaitingToReconnect(true);
                console.log(timeout.current.value);
                // setTimeout(() => {
                //     setWaitingToReconnect(null);
                //     console.log("Reconnect after " + timeout.current.value + " secondes.")
                // }, timeout.current.value);
                reconnectTimeout();


                // console.log("Connection closed")
            }


            return () => {
                ws.current = null;
                socket.close();
            };
        }

    }, [waitingToReconnect]);

    const sendData = ((type, data) => {
        console.log(data)
        const msg = {
            type: type,
            data: data
        };
        ws.current.send(JSON.stringify(msg));
    })

    const getData = (type, callback) => {
        ws.current.addEventListener("message", (event) => {
            const msg = JSON.parse(event.data);
            // console.log("Got message of type : " + msg.type + " - type : " + type)
            if (msg.type === type) {
                callback(msg, event)
            }
        })
    }

    const values = [isReady, sendData, getData, waitingToReconnect, timeout.current ? timeout.current.value : timeouts[0]];

    return (
        <WebsocketContext.Provider value={values}>
            {children}
        </WebsocketContext.Provider>
    );
};

export default WebsocketContainer;