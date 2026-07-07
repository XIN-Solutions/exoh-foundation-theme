(function() {

    Alpine.data('heroSeparatorControls', () => ({
        get config() {
            const form = this.$el?.closest('form.config-form');
            return form ? Alpine.$data(form).config : {};
        },
        init() {
            this.applyPairFromBase();
        },
        applyPairFromBase() {
            const c = this.config;
            if (!c.separatorDifferentTopBottom) {
                const b = c.separatorPairBase;
                c.separatorTopId = b + '_top';
                c.separatorBottomId = b + '_bottom';
            }
        },
        onPairBaseChange() {
            this.applyPairFromBase();
        },
        onDifferentToggle() {
            if (!this.config.separatorDifferentTopBottom) {
                this.applyPairFromBase();
            }
        }
    }));

    // --------------------------------------------------------------------------------
    //      Helper functions for Embedded Video component
    // --------------------------------------------------------------------------------

    function extractYoutubeId(value) {
        const v = (value || '').trim();
        if (!v) {
            return '';
        }

        // an identifier with at least 6 characters
        if (/^[a-zA-Z0-9_-]{6,}$/.test(v)) {
            return v;
        }

        // attempt different ways of matching from a youtube url
        const m1 = v.match(/youtu\.be\/([^?&#/]+)/i);
        if (m1) return m1[1];

        const m2 = v.match(/[?&]v=([^?&#/]+)/i);
        if (m2) return m2[1];

        const m3 = v.match(/youtube\.com\/embed\/([^?&#/]+)/i);
        if (m3) return m3[1];

        return '';
    }

    /**
     * Extract a vimeo identifier.
     * @param value
     * @returns {string}
     */
    function extractVimeoId(value) {
        const v = (value || '').trim();
        if (!v) {
            return '';
        }
        if (/^\d+$/.test(v)) {
            return v;
        }

        const m1 = v.match(/vimeo\.com\/(\d+)/i);
        if (m1) return m1[1];

        const m2 = v.match(/player\.vimeo\.com\/video\/(\d+)/i);
        if (m2) return m2[1];

        return '';
    }

    window.__exohExtractEmbeddedVideoId = function(type, value) {
        if (type === 'vimeo') return extractVimeoId(value);
        return extractYoutubeId(value);
    };

})();