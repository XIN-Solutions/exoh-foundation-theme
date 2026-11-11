(function () {
    const DWELL_MS = 4000;
    const MOTION_MS = 400;
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

    function nextMessageFrame(index, count) {
        if (count < 2) {
            return { index: index, animate: false };
        }
        return { index: (index + 1) % count, animate: true };
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
        const nodes = messages.map((message, i) => {
            const node = messageNode(message);
            if (i === 0) {
                node.classList.add('is-active');
            }
            else {
                node.setAttribute('aria-hidden', 'true');
            }
            return node;
        });
        for (const node of nodes) {
            row.appendChild(node);
        }
        inner.appendChild(row);
        appendButton(inner, config.button);
        mount.appendChild(inner);

        let index = 0;
        function showIndex(i) {
            for (let n = 0; n < nodes.length; n++) {
                const active = n === i;
                nodes[n].classList.toggle('is-active', active);
                nodes[n].setAttribute('aria-hidden', active ? 'false' : 'true');
            }
        }
        showIndex(0);

        if (nextMessageFrame(index, nodes.length).animate) {
            setInterval(function () {
                const frame = nextMessageFrame(index, nodes.length);
                index = frame.index;
                showIndex(index);
            }, DWELL_MS);
        }
    }

    function lockMessageViewport(viewport, nodes) {
        let height = 0;
        for (const node of nodes) {
            height = Math.max(height, Math.ceil(node.offsetHeight));
        }
        if (height < 1) {
            return;
        }
        viewport.style.height = height + 'px';
        for (const node of nodes) {
            node.style.height = height + 'px';
        }
    }

    function parkBelow(node) {
        node.style.transition = 'none';
        node.classList.remove('is-above');
        void node.offsetWidth;
        node.style.transition = '';
    }

    function renderScroll(mount, config, messages) {
        mount.className = 'message-bar__scroll';
        const inner = document.createElement('div');
        inner.className = 'message-bar__inner';

        const viewport = document.createElement('div');
        viewport.className = 'message-bar__viewport';

        const nodes = messages.map((message, i) => {
            const node = messageNode(message);
            if (i === 0) {
                node.classList.add('is-active');
            }
            else {
                node.setAttribute('aria-hidden', 'true');
            }
            return node;
        });
        for (const node of nodes) {
            viewport.appendChild(node);
        }

        inner.appendChild(viewport);
        appendButton(inner, config.button);
        mount.appendChild(inner);

        queueMicrotask(() => {
            lockMessageViewport(viewport, nodes);
        });

        let index = 0;
        if (!nextMessageFrame(index, nodes.length).animate) {
            return;
        }

        function step() {
            const outgoing = nodes[index];
            const frame = nextMessageFrame(index, nodes.length);
            const incoming = nodes[frame.index];

            incoming.classList.remove('is-above');
            incoming.classList.add('is-active');
            incoming.setAttribute('aria-hidden', 'false');

            outgoing.classList.remove('is-active');
            outgoing.classList.add('is-above');
            outgoing.setAttribute('aria-hidden', 'true');

            index = frame.index;

            window.setTimeout(() => {
                parkBelow(outgoing);
                window.setTimeout(step, DWELL_MS);
            }, MOTION_MS);
        }

        window.setTimeout(step, DWELL_MS);
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
        mount.style.setProperty('--message-bar-motion', MOTION_MS + 'ms');

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const animation = config.animation || 'static';
        const siteAnimationsDisabled = getComputedStyle(document.documentElement).getPropertyValue('--theme-aos-disabled').trim() === '1';

        if (reduced) {
            renderReduced(mount, config, current);
        }
        else if (siteAnimationsDisabled) {
            renderStatic(mount, config, current);
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
            isMessageActive,
            nextMessageFrame,
            DWELL_MS
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
