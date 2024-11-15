export function createElement(tag = 'div', text = '', classList = [], attrs = {}) {
    let element = document.createElement(tag)
    element.classList.add(...classList)
    element.innerHTML = text
    for (const prop in attrs) { element[prop] = attrs[prop] }
    return element
}

export function dataToJson(data) { return JSON.stringify(data) }
export function jsonToData(data) { return JSON.parse(data) }
export function getData(name) { return localStorage.getItem(name) }
export function setData(name, data) { localStorage.setItem(name, data) }
