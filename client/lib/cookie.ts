const getCookie = (name: string): string => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        var pair = cookie.split("=");
        if (name == pair[0].trim()) {
            return decodeURIComponent(pair[1]);
        }
    }
    return '';
}

export { getCookie }