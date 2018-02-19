//preloaded.js
//PRELOADS ALL NECESSARY MODULES (JS LIBRARIES))
// AFTAR THAT CALL MAIN.JS INIT

$(document).ready(function(){
    startloadingall();
});

var startloadingall = function(){
    PackageLoader.instance.load({
	    // These frameworks are required for the preloader to run.
        preloader: "lib/requirejs/PackagePreloader.js",
    	jQuery: "lib/jQuery/jquery-2.2.4.min.js",
    	domParent: document.body,
    	waitSeconds : 60,

        paths: {
            "three" : "../lib/three.js/three",
            "stats" : "../lib/three.js/stats.min",
            "orbitControls" : "../lib/three.js/orbitControls",
            "firstPersonControls":"../lib/three.js/firstPersonControls",
            "projector" : "../lib/three.js/projector",
            "canvasRenderer" : "../lib/three.js/canvasRenderer",
            "main" : "main",
            "rloop" : "rloop",
            "setTheStyle": "setTheStyle",
            "stereoEffect" : "../lib/three.js/stereoEffect",
            "deviceOrientationControls" : "../lib/three.js/deviceOrientationControls"            
        }
    }, {
    	// These packages are not necessary to the running of the preloader, but have been used in this example.
    	// In this example, base packages 2 is backbone - reliant on the loading of underscore in base packages 1. Each set of packages begins loading when the previous set has loaded.
        // The keys act as labels for the listing of currently loading packages.
       	// "$": ["..lib/jQuery/jquery-1.11.3.min"],
    	"three": ["../lib/three.js/three"],	
        "stats": ["../lib/three.js/stats.min"],
		"orbitControls" : ["../lib/three.js/orbitControls"],
    	"firstPersonControls":["../lib/three.js/firstPersonControls"],
        "projector" : ["../lib/three.js/projector"],
        "canvasRenderer" : ["../lib/three.js/canvasRenderer"],
    	"main" : ["main"],	
        "rloop" : ["rloop"],
        "setTheStyle" : ["setTheStyle"],
        "stereoEffect" : ["../lib/three.js/stereoEffect"],
        "deviceOrientationControls" : ["../lib/three.js/deviceOrientationControls"]
        
    }, function() {
		// On load, this function is run. This could be used to load a single-page app.
    	requirejs(["main"], function(main){
    	    //console.log('starting');
	        //
    	    main.Init();
	    });
    });
};