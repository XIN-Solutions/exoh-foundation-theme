(function () {
    const FADE_MS = 4000;
    const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

    function parseBound(value) {
        if (value == null || String(value).trim() === '') {
            return null;
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return null;
        }
        return date;
    }

    function isMessageActive(message, now) {
        const from = parseBound(message.showFrom);
        const until = parseBound(message.showUntil);
        const t = now.getTime();

        if (from && t < from.getTime()) {
            return false;
        }
        if (until && t > until.getTime()) {
            return false;
        }
        return true;
    }

    function activeMessages(messages, now) {
        if (!Array.isArray(messages)) {
            return [];
        }
        return messages.filter((message) => isMessageActive(message, now));
    }

    function applyColors(mount, config) {
        if (HEX_COLOR.test(config.backgroundColor || '')) {
            mount.style.backgroundColor = config.backgroundColor;
        }
        if (HEX_COLOR.test(config.textColor || '')) {
            mount.style.color = config.textColor;
        }
    }

    function messageNode(message) {
        const span = document.createElement('span');
        span.className = 'message-bar__message';

        if (message.href) {
            const link = document.createElement('a');
            link.href = message.href;
            link.textContent = message.text || '';
            span.appendChild(link);
        }
        else {
            span.textContent = message.text || '';
        }

        return span;
    }

    function appendButton(inner, button) {
        const label = (button && button.label) ? String(button.label).trim() : '';
        if (!label) {
            return;
        }

        const btn = document.createElement('a');
        btn.className = 'btn btn-sm btn-outline-light message-bar__button';
        btn.textContent = label;
        if (button.href) {
            btn.href = button.href;
        }
        else {
            btn.setAttribute('role', 'button');
        }
        inner.appendChild(btn);
    }

    function renderStatic(mount, config, messages) {
        mount.className = '';
        const inner = document.createElement('div');
        inner.className = 'message-bar__inner';

        const row = document.createElement('div');
        row.className = 'message-bar__messages';
        for (const message of messages) {
            row.appendChild(messageNode(message));
        }
        inner.appendChild(row);
        appendButton(inner, config.button);
        mount.appendChild(inner);
    }

    function renderReduced(mount, config, messages) {
        renderStatic(mount, config, messages.slice(0, 1));
    }

    function renderFade(mount, config, messages) {
        mount.className = 'message-bar__fade';
        const inner = document.createElement('div');
        inner.className = 'message-bar__inner';

        const row = document.createElement('div');
        row.className = 'message-bar__messages';
        const nodes = messages.map((message) => messageNode(message));
        for (const node of nodes) {
            row.appendChild(node);
        }
        inner.appendChild(row);
        appendButton(inner, config.button);
        mount.appendChild(inner);

        let index = 0;
        function showIndex(i) {
            for (let n = 0; n < nodes.length; n++) {
                nodes[n].classList.toggle('is-active', n === i);
            }
        }
        showIndex(0);

        if (nodes.length > 1) {
            setInterval(function () {
                index = (index + 1) % nodes.length;
                showIndex(index);
            }, FADE_MS);
        }
    }

    function renderScroll(mount, config, messages) {
        mount.className = 'message-bar__scroll';
        const inner = document.createElement('div');
        inner.className = 'message-bar__inner';

        const row = document.createElement('div');
        row.className = 'message-bar__messages';

        const track = document.createElement('div');
        track.className = 'message-bar__scroll-track';

        const appendAll = function () {
            for (const message of messages) {
                track.appendChild(messageNode(message));
            }
        };
        appendAll();
        appendAll();

        row.appendChild(track);
        inner.appendChild(row);
        appendButton(inner, config.button);
        mount.appendChild(inner);
    }

    function initMessageBar() {
        const dataEl = document.getElementById('message-bar-data');
        const mount = document.getElementById('message-bar');
        if (!dataEl || !mount) {
            return;
        }

        let config;
        try {
            config = JSON.parse(dataEl.textContent || '');
        }
        catch (err) {
            mount.remove();
            return;
        }

        const now = new Date();
        const current = activeMessages(config.messages, now);
        if (current.length === 0) {
            mount.remove();
            dataEl.remove();
            return;
        }

        applyColors(mount, config);

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const animation = config.animation || 'static';

        if (reduced) {
            renderReduced(mount, config, current);
        }
        else if (animation === 'fade') {
            renderFade(mount, config, current);
        }
        else if (animation === 'scroll') {
            renderScroll(mount, config, current);
        }
        else {
            renderStatic(mount, config, current);
        }

        mount.hidden = false;
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            activeMessages,
            parseBound,
            isMessageActive
        };
    }
    else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initMessageBar);
        }
        else {
            initMessageBar();
        }
    }
}());
