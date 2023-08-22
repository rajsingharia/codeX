

export const checkIsLoggedIn = (): boolean => {
    const accessToken = document?.cookie
        ?.split('; ')
        ?.find((cookie) => cookie.startsWith('accessToken='));

    return !!accessToken; // Return true if the access token cookie exists, otherwise false
};

export const clearCookies = () => {
    // TODO: find a better way to clear cookies
    //document?.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const convertDate = (date: string) => {
    const d = new Date(date);
    // return 01 Jan 2021, 12:00 AM
    return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}, ${d.toLocaleString('default', { hour: 'numeric', minute: 'numeric', hour12: true })}`
}