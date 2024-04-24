import { useEffect, useState } from "react"

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        "width": window.innerWidth,
        "height": window.innerHeight
    })

    useEffect(() => {
        console.log("Window size : width : " + window.innerWidth + " - height : " + window.innerHeight)
    }, [])

    const handleResize = () => {
        console.log("Window size : width : " + windowSize.width + " - height : " + windowSize.height)
        setWindowSize({
            "width": window.innerWidth,
            "height": window.innerHeight,
        })
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return windowSize;
}