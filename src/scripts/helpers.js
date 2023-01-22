export const emit = (name, data = {}, element = document, shouldBubble = false) => {
    let evt;
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

export const listen = (name, handler, element = document) => {
    element.addEventListener(name, handler);
};

export const unlisten = (name, handler, element = document) => {
    element.removeEventListener(name, handler);
};

export const debounce = (fn, time = 200) => {
    let timer;

    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => fn.apply(this, arguments), time);
    }
};