export default function setIntervalImmediatly(callback, delay) {
    callback()
    return setInterval(callback, delay);
}