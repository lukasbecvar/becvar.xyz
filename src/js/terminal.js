import { $, el, reduceMotion } from './dom.js';

/** Fake shell session typed out in the hero terminal. */
function script(projectCount) {
    return [
        { cmd: 'whoami', out: [['', 'lukas – backend developer & sysadmin']] },
        {
            cmd: 'cat stack.txt',
            out: [
                ['lang', 'php, javascript, java, python'],
                ['web', 'symfony, laravel, react'],
                ['infra', 'linux, docker, ci/cd'],
                ['ai', 'llm apis, agents, automation'],
            ],
        },
        { cmd: 'ls ~/projects | wc -l', out: [['', String(projectCount)]] },
    ];
}

const KEY_WIDTH = 8;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function initTerminal(projectCount) {
    const code = $('#terminal code');
    if (!code || reduceMotion) return;

    const promptLine = () => {
        const line = el('span', 't-line');
        const text = el('span');
        const cursor = el('span', 't-cursor');
        line.append(el('span', 't-prompt', '$'), ' ', text, cursor);
        code.append(line);
        return { text, cursor };
    };

    const outputLine = ([key, value]) => {
        const line = el('span', 't-out t-anim');
        if (key) {
            line.append(el('span', 't-key', key), value.padStart(value.length + KEY_WIDTH - key.length));
        } else {
            line.textContent = value;
        }
        code.append(line, '\n');
    };

    const run = async () => {
        await wait(900);
        code.textContent = '';
        for (const { cmd, out } of script(projectCount)) {
            const prompt = promptLine();
            await wait(500);
            for (const ch of cmd) {
                prompt.text.textContent += ch;
                await wait(45 + Math.random() * 70);
            }
            await wait(380);
            prompt.cursor.remove();
            code.append('\n');
            for (const row of out) {
                outputLine(row);
                await wait(110);
            }
            await wait(650);
        }
        promptLine();
    };

    run();
}
