(function() {


    document.addEventListener("onSaveRequest", function(event) {

        let doc = event.detail.pageDoc;
        
        // make sure not dropdown is saved as open
        doc.querySelectorAll(".dropdown-toggle.show,.nav-toggle.show, .dropdown-menu.show").forEach(e => e.classList.remove("show"));
    
        // remove animate on scroll classes
        doc.querySelectorAll("[data-aos]").forEach(e => e.classList.remove("aos-animate", "aos-init"));
    });
    
    
    document.addEventListener("onSaveComplete", function(event) {
    
        let doc = event.detail.pageDoc;

        // add animate on scroll classes back
        doc.querySelectorAll("[data-aos]").forEach(e => {
            e.classList.add("aos-animate");
            e.classList.add("aos-init");
        });
    });
    

})();