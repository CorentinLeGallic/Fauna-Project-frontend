import React, { useEffect, useContext, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WebsocketContext } from "../contexts/Contexts.js";
import setSessionStorage from '../utils/setSessionStorage.js';
import getOccurences from '../utils/getOccurences.js';
import Loader from '../components/Loader.js';
import useToaster from "../hooks/useToaster.js"
import Toast from '../components/Toast.js';
import setIntervalImmediatly from '../utils/setIntervalImmediatly.js';
import useTimeout from "../hooks/useTimeout.js";

const Auth = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const uuid = searchParams.get("uuid");

    const [isReady, sendData, getData, waitingToReconnect, timeout] = useContext(WebsocketContext);

    const [toasts, addToast, editToast] = useToaster()
    // const remainingTime = useRef(null)

    const [animation, setAnimation] = useState(false)

    const navigate = useNavigate();

    const [animationTimeout] = useTimeout(() => {
        setAnimation(true)
    }, 200);

    useEffect(() => {
        animationTimeout()
    }, [setAnimation])

    useEffect(() => {
        if (isReady) {
            // console.log("Is ready : " + Date.now())
            sendData("uuid", {
                uuid: uuid
            })
            getData("open", (msg, event) => {
                // console.log("Got datas : " + Date.now())
                // console.log("GOT DATAS ONOPEN")
                if ("error" in msg && msg.error === 401) {
                    setSessionStorage("user", "")
                    navigate("/unauthorized")
                } else {
                    setSessionStorage("user", msg.data.user)
                    setSessionStorage("grid", msg.data.grid)
                    setSessionStorage("teams", msg.data.teams.map((value, index) => {
                        return {
                            ...value,
                            get progress() { return getOccurences("completed", this.grid) / (msg.data.grid.size ** 2) },
                        }
                    }))
                    setSessionStorage("gameStarted", msg.data.gameStarted)
                    if (msg.data.user.isAdmin) {
                        setSessionStorage("goals", msg.data.goals)
                        if (msg.data.gameStarted) {
                            navigate("/grid")
                        } else {
                            navigate("/teambuilder")
                        }
                    } else {
                        if (msg.data.gameStarted) {
                            navigate("/grid")
                        } else {
                            navigate("/home")
                        }
                    }
                }
            })
        }
    }, [uuid, isReady])

    useEffect(() => {
        if (waitingToReconnect) {
            const id = toasts.length ? toasts[toasts.length - 1].id + 1 : 0;
            // remainingTime.current = 3;
            let remainingTime = timeout / 1000;
            console.log("TIMEOUT : " + timeout + " - - - - - - -")
            console.log(timeout + 1000)
            // remainingTime -= 1;
            addToast({
                id: id,
                icon: "cross",
                text: "Connection au serveur impossible. Nouvelle tentative dans : " + remainingTime + " secondes.",
                timeout: timeout + 1000
                // text: "Connection au serveur impossible. Nouvelle tentative dans : " + remainingTime.current + " secondes."
            }, timeout + 1000)
            // const timeInterval = setInterval(() => {
            //     // console.log(remainingTime.current)
            //     if (remainingTime === 0) {
            //         // if (remainingTime.current === 0) {
            //         clearInterval(timeInterval)
            //     } else {
            //         remainingTime -= 1;
            //         // remainingTime.current -= 1;
            //     }
            //     console.log(remainingTime)
            //     editToast({
            //         id: id,
            //         icon: "cross",
            //         text: "Connection au serveur impossible. Nouvelle tentative dans : " + remainingTime + " secondes.",
            //         timeout: timeout + 1000
            //         // text: "Connection au serveur impossible. Nouvelle tentative dans : " + remainingTime.current + " secondes."
            //     })
            // }, 1000)
            const timeInterval = setIntervalImmediatly(() => {
                // console.log(remainingTime.current)
                if (remainingTime === 0) {
                    // if (remainingTime.current === 0) {
                    clearInterval(timeInterval)
                } else {
                    remainingTime -= 1;
                    // remainingTime.current -= 1;
                }
                console.log(remainingTime)
                editToast({
                    id: id,
                    icon: "cross",
                    text: "Connection au serveur impossible. Nouvelle tentative dans : " + remainingTime + " secondes.",
                    timeout: timeout + 1000
                    // text: "Connection au serveur impossible. Nouvelle tentative dans : " + remainingTime.current + " secondes."
                })
            }, 1000)
        }
    }, [waitingToReconnect])

    return (
        <div className='auth-page'>
            {animation && !waitingToReconnect && <Loader />}
            <ul className='toast-container'>
                {toasts.map((value) => (
                    <Toast value={value} key={value.id} />
                ))}
            </ul>
        </div>
    );
};

export default Auth;