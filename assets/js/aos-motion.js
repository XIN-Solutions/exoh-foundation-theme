(function () {

    const debug = false
    
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

    /**
     * @returns true if the animation  are disabled by a variable declared on the root styles.
     */
    function animationsDisabled() {
        return getComputedStyle(document.documentElement).getPropertyValue('--theme-aos-disabled').trim() === '1';
    }


    function findVisibleSections() {
        const viewportHeight = window.innerHeight;
        const visSections = [];
        
        for (const section of document.querySelectorAll('section')) {
            debug && console.log("Visibility check on section: ", section);
            var items = section.querySelectorAll('[data-aos-order]');
            if (!items.length) {
                continue;
            }
            var rect = section.getBoundingClientRect();
            var inView = rect.top < viewportHeight && rect.bottom > 0;
            if (!inView) {
                continue;
            }

            debug && console.log(".. visible");
            visSections.push(section);
        }

        debug && console.log("Found sections that are visible:", visSections.length);
        return visSections;
    }

    /**
     * For all visible sections, stagger their global animation. 
     * @param {number} stagger - the amount to delay per section.
     */
    function staggerVisibleSectionDelays(stagger) {
        var sectionIndex = 0;

        const visibleSections = findVisibleSections();
        let animDelay = 0;
        for (const section of visibleSections) {

            // all animateable items within the section
            const items = section.querySelectorAll('[data-aos]');

            // shoudl be updated to have additional delay.
            items.forEach(function (el) {
                let base = parseInt(el.getAttribute('data-aos-base-delay'), 10);
                if (!isFinite(base)) {
                    base = 0;
                }
                const total = base + animDelay;
                debug && console.log("Updated: ", el, " delay ", total);
                el.setAttribute('data-aos-delay', String(total));
                el.style.setProperty('--aos-delay', total + 'ms');
            });

            animDelay += stagger;
        }

    }

    /**
     * modify sections and elements to have updated 
     */
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

        // determine delay in milliseconds for each annotated aos element
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

        // some elements are part of a belt that needs to function as the delay anchor.
        document.querySelectorAll('[data-belt-tile][data-aos-order]').forEach(function (el) {
            var section = el.closest('section');
            if (!section) {
                return;
            }
            el.setAttribute('data-aos-anchor', beltAnchorSelector(section));
        });

        staggerVisibleSectionDelays(stagger);

    }

    // run immediately
    applyAosItemMotion();

    // run when new sections appear/are modified.
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