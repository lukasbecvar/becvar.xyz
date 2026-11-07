/** Small DOM helpers shared by all modules. */

export const $ = (selector, ctx = document) => ctx.querySelector(selector);
export const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

export function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
}

export function escapeHtml(value) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value).replace(/[&<>"']/g, (c) => map[c]);
}

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
