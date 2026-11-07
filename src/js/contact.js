import { $ } from './dom.js';
import { t } from './i18n.js';

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    // fallback for http:// and older browsers
    return new Promise((resolve, reject) => {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.append(area);
        area.select();
        try {
            document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
        } catch (error) {
            reject(error);
        } finally {
            area.remove();
        }
    });
}

export function initContact() {
    const button = $('#copy-mail');
    if (!button) return;
    const label = $('span', button);
    const icon = $('i', button);
    let resetTimer;

    button.addEventListener('click', async () => {
        const mail = button.dataset.mail;
        try {
            await copyToClipboard(mail);
            label.textContent = t('contact.copied');
            icon.className = 'bi bi-check2';
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
                label.textContent = t('contact.copy');
                icon.className = 'bi bi-copy';
            }, 2000);
        } catch {
            window.location.href = `mailto:${mail}`;
        }
    });
}
