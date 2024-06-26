export function toLocalStorage(key, value) {
    if (value === null || value === undefined) {
        localStorage.removeItem(key);
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

export function fromLocalStorage(key, defaultValue) {
    const value = localStorage.getItem(key);
    if (value === null || value === undefined) {
        return defaultValue;
    }
    return JSON.parse(value);
}
