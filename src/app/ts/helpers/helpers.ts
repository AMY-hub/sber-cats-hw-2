interface CookieOptions {
    maxAge: number;
}

export const emit = (name: string, data?: any, element: Document | HTMLElement = document, shouldBubble = false) => {
    let evt: CustomEvent;
    if (typeof CustomEvent === 'function') {
        evt = new CustomEvent(name, {
            detail: data,
            bubbles: shouldBubble,
        });
    } else {
        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(name, shouldBubble, false, data);
    }
    element.dispatchEvent(evt);
};

export const listen = (name: string, handler: (e: CustomEvent) => void, element: Document | HTMLElement = document) => {
    element.addEventListener(name, handler as EventListener);
};

export const unlisten = (name: string, handler: (e: CustomEvent) => void, element: Document | HTMLElement = document) => {
    element.removeEventListener(name, handler as EventListener);
};

export const debounce = <F extends (...args: any[]) => any>(fn: F, time = 200) => {
    let timer: NodeJS.Timeout;

    const debounced = (...args: Parameters<F>) => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => fn(...args), time);
    }

    return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

export const getAllCookies = (): Record<string, string> => {
        const cookies = {};
        document.cookie.split('; ')
            .forEach(c => cookies[c.split('=')[0]] = decodeURIComponent(c.split('=')[1]));
        return cookies;
};

export const getCookie = (name: string): string | null => {
    const cookies = getAllCookies();
    return cookies[name] ?? null;
}

export const setCookie = (name: string, value: string, options: CookieOptions): void => {
    let cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if(options.maxAge) {
        cookie += `; max-age=${options.maxAge}`
    }
    document.cookie = cookie;
}

export const checkUser = (login: string, password: string, email: string): boolean => {
    const cookies = getAllCookies();
    if (cookies.catUsername === login 
        && cookies.catUseremail === email
        && cookies.catUserpassword === password) {
            return true;
    }
    return false;
}

export const checkUserCookies = (): boolean => {
    const cookies = getAllCookies();
    if (!cookies.catUsername 
        || !cookies.catUseremail 
        || !cookies.catUserpassword) {
        return false;
    }
    return true;
}

export function getDataFromLS<T>(key: string): T {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}