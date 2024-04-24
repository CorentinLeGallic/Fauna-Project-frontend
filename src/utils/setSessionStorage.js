export default function setSessionStorage(key, newValue) {
    // console.log("SET SESSION STORAGE " + key + " - " + newValue)
    const oldValue = sessionStorage.getItem(key)
    sessionStorage.setItem(key, JSON.stringify(newValue))
    window.dispatchEvent(new StorageEvent('storage', {
        key: key,
        oldValue: JSON.stringify(oldValue),
        newValue: JSON.stringify(newValue),
    }))
}