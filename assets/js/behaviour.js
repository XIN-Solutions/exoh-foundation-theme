(function() {

	let swiper = [];
    
    function initSwiper(onlyNew = false) {
        if (typeof Swiper == "undefined") return;
        let list = document.querySelectorAll('.swiper' + (onlyNew ? ":not(.swiper-initialized)" : "") );
        list.forEach(el => {
            let params = {      
                navigation: false,
                pagination: false,
            };

            const nextEl = el.querySelector(".swiper-button-next");
            const prevEl = el.querySelector(".swiper-button-prev");
            if (nextEl && prevEl)
            {
                params.navigation = { nextEl, prevEl };
            }

            const paginationEl = el.querySelector(".swiper-pagination");
            if (paginationEl)
            {
                params.pagination = { el: paginationEl };
            }

            for (let i in el.dataset) {
                let param = el.dataset[i];
                if (typeof param === "string" && param[0] == '{') {
                    param = JSON.parse(param);
                }
                else if (param === "true" || param === "false")
                {
                    param = (param === "true");
                }
                else if (typeof param === "string" && param.trim() !== "" && !Number.isNaN(Number(param)))
                {
                    param = Number(param);
                }
                params[i] = param;
            }
            swiper.push(new Swiper(el, params))
            //swiper.push(new Swiper(el, { ...{autoplay:{delay: 500}}, ...el.dataset}))		
        });
    }

    if (document.readyState !== 'loading') {
        initSwiper();
    } 
    else {
        document.addEventListener('DOMContentLoaded', initSwiper);
    }


    // make available on the global namespace 
    window.Theme ??= {};
    window.Theme.initSwiper = initSwiper;

})();