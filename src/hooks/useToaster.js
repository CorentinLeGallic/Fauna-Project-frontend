import { useState, useCallback } from "react";
import useTimeout from "./useTimeout";

const useToaster = (defaultValue = []) => {

    const [toasts, setToasts] = useState(defaultValue)
    const [delay, setDelay] = useState(0)

    const [toastTimeout] = useTimeout((args) => {
        setToasts(toasts => toasts.filter((value) => {
            if (value.id === args.toast.id) {
                return false;
            }
            return true;
        }))
    }, delay)

    const addToast = useCallback((toast, timeout) => {
        setDelay(timeout)
        setToasts(toasts.concat(
            [toast]
        ))
        // setTimeout(() => {
        //     setToasts(toasts => toasts.filter((value) => {
        //         if (value.id === toast.id) {
        //             return false;
        //         }
        //         return true;
        //     }))
        // }, timeout)
        toastTimeout({
            toast: toast
        })
    }, [toasts])

    const editToast = useCallback((toast) => {
        setToasts(toasts => toasts.map((value) => {
            if (value.id === toast.id) {
                return toast;
            }
            return true;
        }))
    }, [toasts])

    return [toasts, addToast, editToast];
};

export default useToaster;