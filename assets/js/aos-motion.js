(function () {
    function beltAnchorSelector(section) {
        var ref = section.getAttribute('data-aos-anchor-ref');
        if (!ref) {
            var n = 1;
            ref = 'belt-' + n;
            while (document.querySelector('[data-aos-anchor-ref="' + ref + '"]')) {
                n += 1;
                ref = 'belt-' + n;
            }
            section.setAttribute('data-aos-anchor-ref', ref);
        }
        return '[data-aos-anchor-ref="' + ref + '"]';
    }

    function animationsDisabled() {
        return getComputedStyle(document.documentElement).getPropertyValue('--theme-aos-disabled').trim() === '1';
    }

    function applyAosItemMotion() {
        if (animationsDisabled()) {
            return;
        }
        var rootStyles = getComputedStyle(document.documentElement);
        var duration = parseInt(rootStyles.getPropertyValue('--theme-aos-duration'), 10);
        var stagger = parseInt(rootStyles.getPropertyValue('--theme-aos-stagger'), 10);
        if (!isFinite(duration)) {
            duration = 1000;
        }
        if (!isFinite(stagger)) {
            stagger = 100;
        }
        document.querySelectorAll('[data-aos-order]').forEach(function (el) {
            var order = parseInt(el.getAttribute('data-aos-order'), 10);
            if (!isFinite(order)) {
                order = 0;
            }
            var itemDelay = order * stagger;
            el.setAttribute('data-aos-duration', String(duration));
            el.setAttribute('data-aos-delay', String(itemDelay));
            el.setAttribute('data-aos-base-delay', String(itemDelay));
            el.style.setProperty('--aos-delay', itemDelay + 'ms');
        });
        document.querySelectorAll('[data-belt-tile][data-aos-order]').forEach(function (el) {
            var section = el.closest('section');
            if (!section) {
                return;
            }
            el.setAttribute('data-aos-anchor', beltAnchorSelector(section));
        });
        var viewportHeight = window.innerHeight;
        var chainMax = 0;
        var inViewAnimatedSectionCount = 0;
        document.querySelectorAll('section').forEach(function (section) {
            if (!section.querySelector('[data-aos]')) {
                return;
            }
            var rect = section.getBoundingClientRect();
            var inView = rect.top < viewportHeight && rect.bottom > 0;
            var extra = 0;
            if (inView) {
                if (inViewAnimatedSectionCount === 0) {
                    extra = 0;
                }
                else {
                    extra = chainMax + stagger;
                }
                inViewAnimatedSectionCount += 1;
            }
            var sectionMax = 0;
            section.querySelectorAll('[data-aos]').forEach(function (el) {
                var base;
                if (el.hasAttribute('data-aos-order')) {
                    base = parseInt(el.getAttribute('data-aos-base-delay'), 10);
                    if (!isFinite(base)) {
                        base = 0;
                    }
                }
                else {
                    if (!el.hasAttribute('data-aos-base-delay')) {
                        var editorDelay = parseInt(el.getAttribute('data-aos-delay'), 10);
                        if (!isFinite(editorDelay)) {
                            editorDelay = 0;
                        }
                        el.setAttribute('data-aos-base-delay', String(editorDelay));
                    }
                    base = parseInt(el.getAttribute('data-aos-base-delay'), 10);
                    if (!isFinite(base)) {
                        base = 0;
                    }
                }
                var total = base + extra;
                el.setAttribute('data-aos-delay', String(total));
                el.style.setProperty('--aos-delay', total + 'ms');
                if (total > sectionMax) {
                    sectionMax = total;
                }
            });
            if (inView) {
                chainMax = sectionMax;
            }
        });
    }

    applyAosItemMotion();
    document.addEventListener('onSectionChange', function () {
        applyAosItemMotion();
        if (typeof AOS === 'undefined') {
            return;
        }
        if (typeof AOS.refreshHard === 'function') {
            AOS.refreshHard();
        }
        else if (typeof AOS.refresh === 'function') {
            AOS.refresh();
        }
    });

    AOS.init({
        once: true,
        disable: getComputedStyle(document.documentElement).getPropertyValue('--theme-aos-disabled').trim() === '1'
    });

    if (typeof GLightbox !== 'undefined') {
        GLightbox({
            selector: '.glightbox'
        });
    }
})();