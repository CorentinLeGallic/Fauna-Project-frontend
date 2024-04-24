import { useState, useEffect, useCallback } from "react";
import setSessionStorage from "../utils/setSessionStorage";

const useSessionStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        let currentValue;

        try {
            currentValue = JSON.parse(
                sessionStorage.getItem(key) || String(defaultValue)
            );
        } catch (error) {
            currentValue = defaultValue;
        }

        return currentValue;
    });

    const handleStorageChange = (event) => {
        if (event.key === key) {
            if (event.oldValue !== event.newValue) {
                setValue(JSON.parse(event.newValue))
            }
        }
    }

    const customSetValue = useCallback((newValue) => {
        console.log("new value")
        console.log(newValue)
        setSessionStorage(key, newValue)
    }, []);

    // useEffect(() => {
    //     console.log("Key : " + key + " - value : " + value)
    // }, [value])

    useEffect(() => {
        window.addEventListener("storage", handleStorageChange)

        return () => {
            window.removeEventListener("storage", handleStorageChange)
        }
    }, [setValue])

    return [value, customSetValue];
};

export default useSessionStorage;