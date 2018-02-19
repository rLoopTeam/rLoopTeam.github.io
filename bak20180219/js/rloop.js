define(["setTheStyle", "../lib/three.js/three", "../lib/three.js/orbitControls", "../lib/three.js/firstPersonControls", "../lib/three.js/projector", "../lib/three.js/canvasRenderer", "../lib/three.js/stereoEffect", "../lib/three.js/deviceOrientationControls", "../lib/three.js/stats.min"], function(setTheStyle, THREE, orbitControls, firstPersonControls, Projector, CanvasRenderer, StereoEffect, DeviceOrientationControls, stats) {
    var rloop = {
        mobile: undefined,
        portrait:undefined,
        camera: undefined,
        renderer: undefined,
        scene: undefined,
        content3D: undefined,
        frameID: undefined,
        textures: undefined,
        speedFactor: undefined,
        particles:undefined,
        bufferParticles:undefined,
        particlesOld:undefined,
        animating:undefined,
        animatingTween:undefined,

        whiteColor:undefined,

        animationStep:undefined,
        goForward:undefined,
        goBack:undefined,

        tweensArray:undefined,

        webglAvailable: undefined,

        geometriesArray: undefined,
        idleWithParticles: undefined
    }

    /***private vars***/

    var camFOV = 45;
    var width, height;
    var camNear = 0.01;
    var camFar = 300;
    var controls;
    var controlsFPS;
    var container;

    var raycaster;
    var mouse;

    var clock;
    var cubeContainer = null;
    var cubeArray = [];

    var w = 20;
    var h = 15;

    var debugging = false;

    var imagesArray = [];
    var countLoading = 0;
    var t;
    var imageSteps = ['theraceison.png', 'hyperloop.png', 'earthmap.png', 'justdots.png', 'ppl.png', 'arrow_small.png', 'backdots.png', 'arrow_small_3.png', 'arrow_small_3_rev.png', 'musk_sm.png', 'brain.png' ,'infinity.png'];
    var loadedSteps = {};
    var imageAssets = [];

    var currentStage = 0;
    var scrollMagicController;
    var firstTextAnimationsNotComplete = true;

    var newGeometry;
    var shaderMaterial;
    var material;

    var prevValue = {
        width: 0,
        height: 0
    }

    var iconImages = ['ico__01.png', 'ico__02.png', 'ico__03.png', 'ico__04.png'];
    var iconImages2 = ['ico__large_01.png', 'ico__large_03.png', 'ico__large_02.png', 'ico__large_04.png', 'rocket.png', 'infinity.png', 'projectX.png', 'coins.png', 'earth.png'];
    var iconLogoImages = ['logoP.png', 'logoDungi.png', 'logoTata.png', 'logoSlack.png', 'logoTE.png', 'logoArx.png', 'logoDigi.png', 'logosaAuto.png'];
    var iconLogo2Images = ['logosCBS.png', 'logosBBC.png', 'logosForbes.png', 'logosWired.png', 'logosEcono.png', 'logosWSJ.png', 'logosCNBC.png', 'logosEngi.png'];
    var coinImage = 'coin.png';
    var iconTexts = [{s:780,m:'MPH'}, {s:500,m:'MPH'}, {s:200,m:'MPH'}, {s:80,m:'MPH'}]
    var iconMaterials = [];
    var iconSprites = [];
    var iconSprites2 = [];
    var textGeomsArray = [];
    var iconObject;
    var iconObjectStep2;
    var coinObject;

    var slidesScenes = [];
    var logo1Array = [];
    var logo2Array = [];
    var logo1Object;
    var logo2Object;

    var cameraInitialPosition;
    var cameraLookAtNeutral = new THREE.Vector3(0,0,0);
    var bufferInitialPosition = new THREE.Vector3(0,0,0);
    var bufferInitialRotation = new THREE.Vector3(0,0,0);

    var tweensContainer = [];
    var groupA, groupB, groupC, groupD, groupE, groupF, groupG, groupH, groupI, groupPoints; 

    var defaultPixedSize = 1;
    var slides;
    var circleCenter = new THREE.Vector3(15, 0, 0);
    var enableNext = true;
    var myScroll;
    var scenes = [];
    var activeScenes = [];

    /*** public function ***/

    $.fn.bindFirst = function(name, fn) {
      var elem, handlers, i, _len;
      this.bind(name, fn);
      for (i = 0, _len = this.length; i < _len; i++) {
        elem = this[i];
        handlers = jQuery._data(elem).events[name.split('.')[0]];
        handlers.unshift(handlers.pop());
      }
    };

    function createScenes() {
        slidesScenes = [];
        slides = document.querySelectorAll("section.pageClass")
            
        for (var i=0; i<slides.length; i++) {

            var s = new ScrollMagic.Scene({
                        triggerElement: slides[i]
                    })
                    .setPin(slides[i])                    
                    .on('enter', function (e){
                        //leavingScene( e );
                        //console.log('entered')
                        startScene( e );
                    })
                    .on('start' , function (e){
                        leavingScene ( e );
                    })
                    .on('progress', function (e) {
                        progressInScene()
                    })
                    .on('update', function (e) {
                        //console.log('should update...')
                        var currentMoving = parseInt($(e.target.triggerElement()).attr('id').split('pag')[1]) - 1;
                        //console.log('current moving: ', currentMoving, 'current stage: ', currentStage)
                        if (currentMoving != currentStage) return;
                        sliderUpdate(e);
                                       
                    } )
                    .on('shift', function(e){
                        //console.log('shifted: ', $(e.target.triggerElement()).attr('id') );
                    })
                    .addTo(scrollMagicController)

            //if (!rloop.mobile) s.addIndicators();

            slidesScenes.push(s);

            }
    }


    rloop.PreInit = function(isMobile, portrait, data) {
        //jq("#header").sticky({topSpacing:0, zIndex:10000});
        //jq("#coin").sticky({topSpacing:0, zIndex:10005});

        
        
        var timer;
        var scrolling = false;
        // $(window).bindFirst('scroll', function() {
        //     clearTimeout(timer);
        //     scrolling = true;
        //     timer = setTimeout ( refresh, 100);
        // });
        // var refresh = function() {
        //     scrolling = false;
        //     //console.log('stopped scrolling');
        // }
        rloop.mobile = isMobile;
        rloop.portrait = portrait;

        //rloop.mobile = true;
        if ( true )
        {
            if (rloop.mobile)
            {
                scrollMagicController = new ScrollMagic.Controller({
                    container: "#containerScroll",
                    globalSceneOptions: {
                        triggerHook: 'onLeave',

                    }
                }); 
            }           
            else {
                scrollMagicController = new ScrollMagic.Controller({
                    //container: "#containerScroll",
                    globalSceneOptions: {
                        triggerHook: 'onLeave',

                    }
                });            
            }

            slides = document.querySelectorAll("section.pageClass")
            
            for (var i=0; i<slides.length; i++) {

                var s = new ScrollMagic.Scene({
                        triggerElement: slides[i]
                    })
                    .setPin(slides[i])                    
                    .on('enter', function (e){
                        //leavingScene( e );
                        //console.log('entered')
                        startScene( e );
                    })
                    .on('start' , function (e){
                        leavingScene ( e );
                    })
                    .on('progress', function (e) {
                        progressInScene()
                    })
                    .on('update', function (e) {
                        //console.log('should update...')
                        var currentMoving = parseInt($(e.target.triggerElement()).attr('id').split('pag')[1]) - 1;
                        //console.log('current moving: ', currentMoving, 'current stage: ', currentStage)
                        if (currentMoving != currentStage) return;
                        sliderUpdate(e);
                                       
                    } )
                    .on('shift', function(e){
                        //console.log('shifted: ', $(e.target.triggerElement()).attr('id') );
                    })
                    .addTo(scrollMagicController)

                    //if (!rloop.mobile) s.addIndicators();

                    slidesScenes.push(s);

            }


            if (rloop.mobile) 
            {
                myScroll = new IScroll('#containerScroll', {
                    scrollX: false,
                    // but do scroll vertical
                    scrollY: true,
                    // show scrollbars
                    scrollbars: false,
                    snap: false,
                    // deactivating -webkit-transform because pin wouldn't work because of a webkit bug: https://code.google.com/p/chromium/issues/detail?id=20574
                    // if you dont use pinning, keep "useTransform" set to true, as it is far better in terms of performance.
                    useTransform: false,
                    // deativate css-transition to force requestAnimationFrame (implicit with probeType 3)
                    useTransition: false,
                    // set to highest probing level to get scroll events even during momentum and bounce
                    // requires inclusion of iscroll-probe.js
                    probeType: 3,
                    // pass through clicks inside scroll container
                    click: true 
                    }
                );


                scrollMagicController.scrollPos(function(){
                    return -myScroll.y;
                });

                myScroll.on('scroll', function(){
                    scrollMagicController.update();
                })
                    //s.addIndicators({parent: '.container'})
                    //console.log('myScroll: ', myScroll);            
                // scrollMagicController.scrollTo( function(newpos){
                //     //console.log('trying to scroll to position:', newpos);
                //     //myScroll.scrollTo(0, newpos, 1000)
                // });
            }

            scrollMagicController.enabled(false);
        }

        setTheStyle.set_layout();
        //console.log('runnging');
        //return;


        

        rloop.scene = new THREE.Scene();
        container = document.getElementById("webGLContent");
        width = container.clientWidth;
        height = container.clientHeight;

        var imageAssets = [
            { name: 'step1', url:'theraceison.png'},
            { name: 'step2', url:'hyperloop.png'},
            { name: 'step3', url:'earthmap.png'}
        ];

        this.textures = {};
        this.geometriesArray = [];
        this.speedFactor = 0.03;
        this.particles = {};
        this.animating = false;
        this.animationStep = 0;
        this.goForward = 1;
        this.goBack = -1;
        this.animatingTween = false;
        this.whiteColor = new THREE.Color('rgb(255,255,255)');
        this.idleWithParticles = false;


        //rloop.scene.add(iconObject);
        groupA = new TWEEN.Group();
        groupB = new TWEEN.Group();
        groupC = new TWEEN.Group();
        groupD = new TWEEN.Group();
        groupE = new TWEEN.Group();
        groupF = new TWEEN.Group();
        groupG = new TWEEN.Group();
        groupH = new TWEEN.Group();
        groupI = new TWEEN.Group();
        groupPoints = new TWEEN.Group();

        

        prevValue.width = window.innerWidth;
        prevValue.height = window.innerHeight;

        clock = new THREE.Clock();
        var zoomFromStandard = window.innerWidth / (1600 ) ;
        /*
        
        //console.log('zoomFromStandard: ', zoomFromStandard);
        if (zoomFromStandard) { //} && window.devicePixelRatio<=1) {
            //camFOV = 45 / (zoomFromStandard*1.2);
            if (portrait) camFOV = 45 / (zoomFromStandard*1.1);
            else camFOV =  50 / (zoomFromStandard*1.0);
        }
        */

        //if (window.devicePixelRatio > 1 && !rloop.mobile) defaultPixedSize = defaultPixedSize / 2;
        //console.log('default pixel size: ', defaultPixedSize)
        //defaultPixedSize = 1;
        // if (rloop.portrait) {
        //     camFOV = camFOV * 2.3;
        //     defaultPixedSize = defaultPixedSize / 1.5;  
        // } 

        defaultPixedSize = defaultPixedSize * (zoomFromStandard*1.2);
        if (zoomFromStandard>1 || rloop.mobile) defaultPixedSize = 1;
        //rloop.scene.add(iconSprites);

        //cubeContainer = new THREE.Object3D();
        //rloop.scene.add(cubeContainer);

        addRenderer3D(container, width, height);
        //if (bokeh) initPostProcessing();
        addCamera3D();
        addImages();
        addIcons();
        //addMaterials();
        addLight3D();
        ///addSkyBox();
        ///addButtons();
        addControls();
        //addTree()
        //initCubes();
        //console.log('start interval')
        t = setInterval(function() {
            if (imageSteps.length == countLoading) {
                //console.log('steps loaded: ', loadedSteps);
                clearInterval(t);
                rloop.animationStep = 0;
                generateAllGeometries();
                var partOobj = createGeometryFromInameData(loadedSteps[imageSteps[rloop.animationStep]].imgData, loadedSteps[imageSteps[rloop.animationStep]].img);
                rloop.particles = partOobj.particles;
                rloop.bufferParticles = partOobj.bParticles;
                //rloop.bufferParticles.position.y = 0.3;                
                rloop.scene.add(rloop.bufferParticles);
                startAnimationStep(rloop.particles);
                //rloop.animating = true;
                //console.log('inscene now: ', rloop.scene);
                //displayImageInCubes(imagesArray[0]);
            }
        }, 500)

        //addEvents();
        onWindowResize();
        window.addEventListener( 'resize', onWindowResize, false );
        rloop.Animate();
    }

    var currentPage = 0;

    function addEvents()
    {
        $('#logoCont').on('click', function(e){
            //click on logo
            var durr = currentPage * 300;
            currentPage = 0;
            gotoPageAndFade(0, -1, durr);
        })

        $('#roadmapBtn').on('click', function (e){
            var url = 'pdf/roadmap.pdf';
            window.open(url,'_blank');
            //Clicked on road map
        })

        $('#watchVideoBtn').on('click', function (e){
            var url = 'http://c.brightcove.com/services/viewer/htmlFederated?&width=620&height=363&flashID=myExperience5266210989001&identifierClassName=BrightcoveExperienceID_9508&bgcolor=%23000000&playerID=default&playerKey=AQ~~%2CAAABNbwiBqk~%2CuKJgjFOOWvE3WByT-ymNV7DaGn-7XkD6&isVid=true&isUI=true&dynamicStreaming=true&autoStart=true&wmode=transparent&%40videoPlayer=5266210989001&htmlFallback=true&includeAPI=true&templateLoadHandler=myTemplateLoaded&templateReadyHandler=onTemplateReady&debuggerID=&startTime=1508359072844&refURL=not%20available';
            window.open(url,'_blank');
            //Clicked on road map
        })

        $('#watchVideoBtn2').on('click', function (e){
            var url = 'https://www.youtube.com/watch?v=C0wcdmJ_2ks&feature=youtu.be';
            window.open(url,'_blank');
            //Clicked on road map
        })

        $('#onePagerBtn').on('click', function (e){
            var url = 'pdf/rLoop_one_pager.pdf';
            window.open(url,'_blank');
            //Clicked on one pager
        })
        //watchVideoBtn

        $('#btnh1').on('click', function(e){
            //Clicked on reddit
            var url = 'https://www.reddit.com/r/rLoop/';
            window.open(url,'_blank');
            
        })

        $('#btnh2').on('click', function(e){
            //Clicked on youtube
            var url = 'https://www.youtube.com/channel/UCFxqcu0vH567d1F09xso8Tg';
            window.open(url,'_blank');
            
        })

        $('#btnh3').on('click', function(e){
            //Clicked on twitter
            var url = 'https://twitter.com/rLoopTeam';
            window.open(url,'_blank');
            
        })

        $('#btnh4').on('click', function(e){
            var url = 'pdf/rLoop_one_pager.pdf';
            window.open(url,'_blank');
            //Clicked on one pager
        })

        document.getElementById('btnDown').addEventListener('click', function(event){
            var nextPage = currentPage + 1 < slides.length ? currentPage+1 : -1;
            if (nextPage >=0) {
                //console.log('enableNext: ', enableNext);
                if (enableNext) {
                    runTimer();                    
                }
                else return;
                if (gotoPageAndFade(nextPage, currentPage)) currentPage = nextPage;
            }
        });

        document.getElementById('btnUp').addEventListener('click', function(event){
            var nextPage = currentPage - 1 >= 0 ? currentPage - 1 : -1;
            if (nextPage >=0) {
                if (enableNext) {
                    runTimer();                    
                }
                else return;
                if (gotoPageAndFade(nextPage, currentPage)) currentPage = nextPage;
            }
        });

        window.addEventListener('wheel', function(event){
            event.preventDefault();
            event.stopPropagation();
            //console.log('enable next: ', enableNext);
            var nextPage;
            if (event.deltaY > 0)
            {
                nextPage = currentPage + 1 < slides.length ? currentPage+1 : -1;
            } else {
                nextPage = currentPage - 1 >= 0 ? currentPage - 1 : -1;
            }

            if (nextPage >=0) {
                if (enableNext) {
                    runTimer();                    
                }
                else return;
                //console.log('goin to: ', nextPage);
                if (gotoPageAndFade(nextPage, currentPage)) currentPage = nextPage;
            }
            //console.log('scroll event: ', event);
        });

        $(window).on('touchstart', function(e)
        {
            // if ($(e.target).closest('#mobileMenuHeader').length == 1)
            // {
            //     blockMenuHeaderScroll = true;
            // }
        });
        $(window).on('touchend', function()
        {
            //blockMenuHeaderScroll = false;
        });
        $(window).on('touchmove', function(e)
        {
            //console.log('touch here');
            e.preventDefault();
            // if (blockMenuHeaderScroll)
            // {
            //     e.preventDefault();
            // }
        });

        document.addEventListener('scroll', function(event){
            //console.log('event: ', event);
            //event.preventDefault();
            //var nextPage;
            
            // if (event.deltaY > 0)
            // {
            //     nextPage = currentPage + 1 < slides.length ? currentPage+1 : -1;
            // } else {
            //     nextPage = currentPage - 1 >= 0 ? currentPage - 1 : -1;
            // }

            // if (nextPage >=0) {
            //     if (enableNext) {
            //         runTimer();                    
            //     }
            //     else return;
            //     gotoPageAndFade(nextPage, currentPage);
            //     currentPage = nextPage;
            // }
            //console.log('scroll event: ', event);
        })
    }
    
    function generateAllGeometries()
    {
        //// First Element is THE RACE IS ON
        var el = createGeomFromImageData(loadedSteps[imageSteps[0]].imgData);

        rloop.geometriesArray.push(el);

        //// SECOND ELEMENT IS    HYPERLOOPO
        el = createGeomFromImageData(loadedSteps[imageSteps[1]].imgData);
        rloop.geometriesArray.push(el);

        //// THIRD ELEMENT IS CIRCLE
        //createThreeCirclesGeometry ( spritesPerCircle, raza1, zDistance, xDistance, numberOfCircles, center, scaleFactor, firstScale, , distort, sameScale, distanceMultiplier
        
        //coinObject.position = circleCenter;
        el = createThreeCirclesGeometry(70, 15, 5, 3, 4, circleCenter, 1.4, 1.5, Math.PI/140);
        rloop.geometriesArray.push(el);

        //// FOURTH ELEMENT IS MAP!!!
        el = createGeomFromImageData(loadedSteps[imageSteps[2]].imgData);
        rloop.geometriesArray.push(el);

        //// Fifth ELEMENT IS the the speed dots
        el = createGeomFromImageData(loadedSteps[imageSteps[3]].imgData);
        rloop.geometriesArray.push(el);

        //// Sixth ELEMENT IS the people
        el = createGeomFromImageData(loadedSteps[imageSteps[4]].imgData, 1.8, true);
        rloop.geometriesArray.push(el);

        //// Seventh ELEMENT IS the arrow
        el = createGeomFromImageData(loadedSteps[imageSteps[5]].imgData, 1.8, true);
        rloop.geometriesArray.push(el);

        // Eight ELEMENT is arrow + logo bg
        var temp = createGeomFromImageData(loadedSteps[imageSteps[6]].imgData, 1.8, true);
        el = addTwoGeometries(rloop.geometriesArray[6], temp, 37);
        rloop.geometriesArray.push(el);

        // Ninth ELEMENT is arrow + logo bg + arrow*3
        var temp = createGeomFromImageData(loadedSteps[imageSteps[7]].imgData, 1.8, true);
        el = addTwoGeometries(rloop.geometriesArray[7], temp, 75);
        rloop.geometriesArray.push(el);

        // Tenth ELEMENT is arrow + logo bg + arrow*3 + arrow*3 reversed
        var temp = createGeomFromImageData(loadedSteps[imageSteps[8]].imgData, 1.8, true);
        el = addTwoGeometries(rloop.geometriesArray[8], temp, 123);
        rloop.geometriesArray.push(el);

        //// Eleventh ELEMENT IS the MUSK
        el = createGeomFromImageData(loadedSteps[imageSteps[9]].imgData, 1.5, true);
        rloop.geometriesArray.push(el);

        //// Twelvth ELEMENT IS the circles inside
        var circCent = new THREE.Vector3(0,0,0)
        //circCent.y -= 20;
        el = createThreeCirclesGeometry(50, 13, 20, 0, 10, circCent, 1, 1.5, 0, true, 1);
        rloop.geometriesArray.push(el);

        //// Thirteenth ELEMENT IS the BRAIN
        el = createGeomFromImageData(loadedSteps[imageSteps[10]].imgData, 1.5, true);
        rloop.geometriesArray.push(el);

        //// Fourteenth ELEMENT IS the LAST CIRCLES
        el = createThreeCirclesGeometry(60, 25, 9, 5.6, 5, new THREE.Vector3(0,0,0), 1.2, 2.2, Math.PI/60, false, 1);
        rloop.geometriesArray.push(el);

        console.log('All geometries generated: ', rloop.geometriesArray);
    }
    var time = 0;
    rloop.Animate = function(a) {
        //console.log('a: ', a);
        if (debugging) stats.begin();

        

        TWEEN.update();
        groupA.update();
        groupB.update();
        groupC.update();
        groupD.update();
        groupE.update();
        groupF.update();
        groupG.update();
        groupH.update();
        groupI.update();
        groupPoints.update();

        if (rloop.animatingTween)
        {
            //if (rloop.bufferParticles) console.log('animating particles: ', rloop.bufferParticles.geometry.attributes.alpha.array[0])
            rloop.particles.geometry.verticesNeedUpdate = true;
            // for (var i = 0, i3 = 0; i< rloop.particles.geometry.vertices.length; i++, i3+=3)
            // {
                
            // }

            rloop.bufferParticles.geometry.attributes.position.needsUpdate = true;
            rloop.bufferParticles.geometry.attributes.alpha.needsUpdate = true; // important!
        }

        if (rloop.idleWithParticles)
        {
            time++;
            //rloop.camera.position.x = Math.sin(time / 500) * 5;

            rloop.bufferParticles.rotation.y = Math.sin(time / 5000) ;
            //console.log('camera moving?')
            //rloop.camera.lookAt(rloop.bufferParticles.position);
        }

        /*
        if (rloop.animating)
        {
            //console.log('animating:')
            var countFinishedParticles = 0;
            for (var i = 0; i< rloop.particles.geometry.vertices.length; i++)
            {
                var part = rloop.particles.geometry.vertices[i];
                if (part.x == part.destination.x && part.y == part.destination.y && part.z == part.destination.z)
                {   
                    countFinishedParticles++;                    
                } else {

                    if (part.back)
                    {                        
                        //part.x += (part.destination.x - part.destination.x * strongEaseOut(part.x, part.destination.x)) * part.speed;
                        //part.y += ( part.destination.y - part.destination.y * strongEaseOut(part.y, part.destination.y)) * part.speed;
                        //part.z += (part.destination.z - part.destination.z * strongEaseOut(part.z, part.destination.z)) * part.speed;

                        part.x += (part.destination.x - part.x) * part.speed;
                        part.y += (part.destination.y - part.y) * part.speed;
                        part.z += (part.destination.z - part.z) * part.speed;
                        //console.log('particle: ', (part), ' particle dest: ', (part.destination))
                        if ((Math.abs(part.x) > Math.abs(part.destination.x))) 
                        //if (Math.abs(part.x - part.destination.x)<0.005)
                        {
                            part.x = part.destination.x;                        
                            //console.log('bigger x: ', part);
                        }
                        if ((Math.abs(part.y) > Math.abs(part.destination.y)))
                        //if (Math.abs(part.y - part.destination.y)<0.005)
                            part.y = part.destination.y;
                        if ((Math.abs(part.z) > Math.abs(part.destination.z))) 
                        //if (Math.abs(part.z - part.destination.z)<0.005)
                            part.z = part.destination.z;
                        // (part.destinationOld.x - part.x) * part.speed;
                        //part.y += (part.destinationOld.y - part.y) * part.speed;
                        //part.z += (part.destinationOld.z - part.z) * part.speed;
                    } else {
                        part.x += (part.destination.x - part.x) * part.speed;
                        part.y += (part.destination.y - part.y) * part.speed;
                        part.z += (part.destination.z - part.z) * part.speed;

                        //console.log('difference: ', part.x - part.destination.x)
                        if (Math.abs(part.x - part.destination.x)<0.005) part.x = part.destination.x;
                        if (Math.abs(part.y - part.destination.y)<0.005) part.y = part.destination.y;
                        if (Math.abs(part.z - part.destination.z)<0.005) part.z = part.destination.z;
                    }
                }
            }

            rloop.particles.geometry.verticesNeedUpdate = true;

            //console.log('total finished particles: ', countFinishedParticles);
            if (countFinishedParticles == rloop.particles.geometry.vertices.length)
            {
                //console.log('finished animation step: ', rloop.animationStep);
                rloop.animating = false;
                thisAnimationFinished(rloop.animationStep, rloop.goForward);
            }
        }
        */

        rloop.renderer.render(rloop.scene, rloop.camera);
        if (debugging) stats.end();



        rloop.frameID = requestAnimationFrame(rloop.Animate);
    }

    //rloop
  // draw(20);


    /*** private functions ***/

    function addRenderer3D(cont, w, h) {
        // adding renderer
        rloop.webglAvailable = webglAvailable();
        //console.log('webGl available: ', rloop.webglAvailable);
        rloop.renderer = rloop.webglAvailable ? new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            transparent: true
        }) : new THREE.CanvasRenderer({
            antialias: true,
            alpha: true
        });
        rloop.renderer.setPixelRatio(window.devicePixelRatio)
        rloop.renderer.sortElements = true;
        rloop.renderer.setSize(w, h);
        rloop.renderer.domElement.id = 'webGLCanv';

       

        rloop.renderer.setClearColor(0x000000, 0 );

        rloop.renderer.gammaInput = true;
        rloop.renderer.gammaOutput = true;

        cont.appendChild(rloop.renderer.domElement);

         cont.getShaderInfoLog = function () { return '' };
    }

    function addCamera3D() {
        //adding camera
        if (rloop.portrait) {
            //camFOV = camFOV * 2.3;
           // defaultPixedSize = defaultPixedSize / 1.5;  
        } 
        //console.log('cam fov:', camFOV, rloop.mobile, rloop.portrait)
        rloop.camera = new THREE.PerspectiveCamera(camFOV, width / height, camNear, camFar);
        rloop.camera.position.set(-0, 0, 32.5);
        rloop.camera.rememberPosition = rloop.camera.position.clone();
        cameraInitialPosition = rloop.camera.position.clone();
        //(0, 50, 10);
        rloop.scene.add(rloop.camera);
    }

    function addControls() {

        // adding controls

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();


        controls = new THREE.OrbitControls(rloop.camera, rloop.renderer.domElement);

        controls.minDistance = 5;
        controls.maxDistance = 23;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        //controls.maxPolarAngle = 1.5 * Math.PI / 2;
        //controls.minPolarAngle =  0.4 * Math.PI / 2;

        controls.rotateSpeed = 0.1;
        controls.target = new THREE.Vector3(0, 0, 0);
        controls.target0 = new THREE.Vector3(0, 0, 0);
        controls.enableKeys = true;
        //controls.enablePan  =false;

        if (debugging) {
            //console.log('debug mode');
            controls.enablePan = true;
            controls.enableRotate = true;
            controls.enableZoom = true;

            controls.minDistance = 1;
            controls.maxDistance = Infinity;
            controls.minZoom = 0;
            controls.maxZoom = Infinity;
            addStats();
        }

        controls.autoRotate = true;
        controls.autoRotateSpeed = -0.055;

        controls.update();
    }

    function addIcons() {

        coinObject = new THREE.Object3D();
        var coinTex = new THREE.TextureLoader().load("img/assets/"+ coinImage);
        var coinMat = new THREE.MeshBasicMaterial({map:coinTex, transparent: true})
        var coinMesh = new THREE.Mesh(new THREE.CylinderGeometry(5,5,0.01,48, 1, false), coinMat);
        coinMesh.rotation.x -= Math.PI/2;
        coinMesh.rotation.y += Math.PI/2;
        //coinMesh.rotation.z -=Math.PI/2;
        coinMesh.position.x = 0;
        coinMesh.position.y = 0;
        coinObject.position.x = circleCenter.x - 7.1;
        coinObject.position.y = circleCenter.y + 0.5;
        coinObject.rotation.y = Math.PI/2 - Math.PI/11.25;
        coinObject.visible = false;
        //coinObject.
        coinObject.position.z = 3;
        coinObject.add(coinMesh);

        rloop.scene.add(coinObject);


        iconObject = new THREE.Object3D();
        
        for (var q=0;q<iconImages.length;q++)
        {   
            // iconImages[q]
            var spriteMaT = new THREE.TextureLoader().load("img/sprites/"+ iconImages[q], function(img){
                //console.log('loaded: ', img);
            });            
            var spriteii = new THREE.Sprite( new THREE.SpriteMaterial( {
                map:spriteMaT, 
                color: 0xFFFFFF,
                //blending: THREE.AdditiveBlending,
                depthTest: false,
                depthWrite:false,
                transparent: true

            }) );
            //console.log('generated sprite: ', spriteii);
            spriteii.position.set(0,0,0);
            spriteii.scale.set(1, 1, 1);
            spriteii.visible = false;
            //iconArray.push(spriteii);
            iconSprites.push(spriteii);

            iconObject.add(spriteii);
            //rloop.scene.add(spriteii);
        }

        logo1Object = new THREE.Object3D();
        for (q = 0;q<iconLogoImages.length;q++)
        {
            var spriteM = new THREE.TextureLoader().load("img/sprites/logos/"+iconLogoImages[q]);
            var spr = new THREE.Sprite( new THREE.SpriteMaterial( {
                map:spriteM,
                color: 0xFFFFFF,
                depthTest: false,
                depthWrite:false,
                transparent: true

            } ))
            spr.scale.set(4.8, 4.8, 4.8);
            switch (q) {
                case 0:
                    spr.position.set(5, 4.5, 0);
                    break;
                case 1:
                    spr.position.set(9.2, 7, 0)
                    spr.scale.set(3,3,3)
                    break;
                case 2:
                    spr.position.set(13, 5, 0)
                    spr.scale.set(3.7,3.7,3.7)
                    break;
                case 3:
                    spr.position.set(8.2, 0.5, 0)
                    spr.scale.set(4.1,4.1,4.1)
                    break;
                case 4:
                    spr.position.set(14.2, -0.1, 0)
                    spr.scale.set(5.1,5.1,5.1)
                    break;
                case 5:
                    spr.position.set(5, -5, 0)
                    spr.scale.set(3.8,3.8,3.8)
                    break;
                case 6:
                    spr.position.set(10, -4.5, 0)
                    spr.scale.set(4.1,4.1,4.1)
                    break;
                case 7:
                    spr.position.set(15, -6.5, 0)
                    spr.scale.set(4.7,4.7,4.7)
                    break;
            }            
            spr.scaleTo = spr.scale.clone();
            spr.scale.set(0,0,0);
            logo1Array.push(spr);
            logo1Object.add(spr);
        }

        logo2Object = new THREE.Object3D();

        for (q = 0;q<iconLogo2Images.length;q++)
        {
            var spriteM = new THREE.TextureLoader().load("img/sprites/logos/media/"+iconLogo2Images[q]);
            var spr = new THREE.Sprite( new THREE.SpriteMaterial( {
                map:spriteM,
                color: 0xFFFFFF,
                depthTest: false,
                depthWrite:false,
                transparent: true

            } ))
            spr.scale.set(4.8, 4.8, 4.8);
            switch (q) {
                case 0:
                    spr.position.set(5, 4.5, 0);
                    break;
                case 1:
                    spr.position.set(9.2, 7, 0)
                    spr.scale.set(3,3,3)
                    break;
                case 2:
                    spr.position.set(13, 5, 0)
                    spr.scale.set(3.7,3.7,3.7)
                    break;
                case 3:
                    spr.position.set(8.2, 0.5, 0)
                    spr.scale.set(4.1,4.1,4.1)
                    break;
                case 4:
                    spr.position.set(14.2, -0.1, 0)
                    spr.scale.set(5.1,5.1,5.1)
                    break;
                case 5:
                    spr.position.set(5, -5, 0)
                    spr.scale.set(3.8,3.8,3.8)
                    break;
                case 6:
                    spr.position.set(10, -4.5, 0)
                    spr.scale.set(4.1,4.1,4.1)
                    break;
                case 7:
                    spr.position.set(15, -6.5, 0)
                    spr.scale.set(4.7,4.7,4.7)
                    break;
            }            
            spr.scaleTo = spr.scale.clone();
            spr.scale.set(0,0,0);
            logo2Array.push(spr);
            logo2Object.add(spr);
        }

        iconObjectStep2 = new THREE.Object3D();
        for (q=0;q<iconImages2.length;q++)
        {
            var spriteMa = new THREE.TextureLoader().load("img/sprites/"+ iconImages2[q], function(img){
                }); 

            var spriteiii = new THREE.Sprite( new THREE.SpriteMaterial( {
                map:spriteMa, 
                color: 0xFFFFFF,
                depthTest: false,
                depthWrite:false,
                transparent: true
            }) );  
            spriteiii.position.set(q*12 - 36,0,0);
            spriteiii.scale.set(12, 12, 12);
            if (q==1) spriteiii.scale.set(5, 5, 5);
            if (q==3) 
            {
                spriteiii.scale.set(20, 13, 20);
                spriteiii.position.x += 20;
                spriteiii.position.y += 1;
            }
            if (q==4)
            {
                spriteiii.position.x = 50;
                spriteiii.position.y += 16;
                spriteiii.scale.set(10, 12, 12);
            }
            if (q==5)
            {
                spriteiii.position.x = 50;
                spriteiii.position.y = 0;
                spriteiii.scale.set(14, 8, 1);
            }
            if (q==6)
            {
                spriteiii.position.x = 50;
                spriteiii.position.y -= 16;
                spriteiii.scale.set(15, 15, 1);
            }
            if (q==7)
            {
                spriteiii.position.x = 75;                
            }
            if (q==8)
            {
                var plusSprite = iconSprites2[1].clone();
                plusSprite.scaleTo = iconSprites2[1].scaleTo;
                plusSprite.position.x = 87;
                iconSprites2.push(plusSprite);
                iconObjectStep2.add(plusSprite);

                spriteiii.position.x = 99;
            }


            spriteiii.scaleTo = spriteiii.scale.clone();
            spriteiii.visible = false;

            iconSprites2.push(spriteiii);            
            iconObjectStep2.add(spriteiii);
        }
        
        var loader = new THREE.FontLoader();

        loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
            
            for (q = 0;q<iconImages.length;q++)
            {
                var bothGeoms = new THREE.Object3D();
                var geometry = new THREE.TextGeometry( iconTexts[q].s, {
                    font: font,
                    size: 0.9,
                    height: 0.01
                } );

                var geometry2 = new THREE.TextGeometry( iconTexts[q].m, {
                    font: font,
                    size: 0.5,
                    height: 0.01
                    
                } );

                var mat = new THREE.MeshBasicMaterial({color:0xFFFFFF, opacity:0, transparent:true});
                var t1 = new THREE.Mesh(geometry, mat);
                var t2 = new THREE.Mesh(geometry2, mat);
                
                t1.position.y = iconSprites[q].position.y;

                t2.position.x = 2.2;
                t2.position.y = iconSprites[q].position.y;


                bothGeoms.add(t1);
                bothGeoms.add(t2);
                bothGeoms.t1 = t1;
                bothGeoms.t2 = t2;
                textGeomsArray.push(bothGeoms);
                iconObject.add(bothGeoms);
            }
            //iconObject.add(allTextGeoms);
        } );        

        rloop.scene.add(iconObject);
        rloop.scene.add(iconObjectStep2);
        rloop.scene.add(logo1Object);
        rloop.scene.add(logo2Object);
    }

    function addImages() {
      

        for (var i=0;i<imageSteps.length;i++)
        {
            var loader = new THREE.ImageLoader();
            var url = 'img/steps/' + imageSteps[i];
            // load a image resource
            loader.stepi = i;
            loader.load(
                // resource URL
                url,
                // Function when resource is loaded
                function ( image ) {
                    // do something with it
                    var short = getShort(image.src);
                    loadedSteps[short] = {img: image, imgData: getImageData(image)};
                    //console.log('this step: ', image.src);
                    countLoading++;
                    // like drawing a part of it on a canvas                    
                },
                // Function called when download progresses
                function ( xhr ) {
                    //console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
                },
                // Function called when download errors
                function ( xhr ) {
                    console.log( 'An error happened' );
                }
            ); 
        }
    }

    function startScene(event)
    {
        if (event.scrollDirection!="PAUSED")
            currentStage = parseInt($(event.target.triggerElement()).attr('id').split('pag')[1]) - 1;
        //console.log('start scene with event: ', currentStage)
    }

    function leavingScene(event)
    {
        if (event.scrollDirection == 'REVERSE' && event.scrollDirection!="PAUSED")
            currentStage = parseInt($(event.target.triggerElement()).attr('id').split('pag')[1]) - 2;
        //console.log('leaving scene with event: ', currentStage)
    }

    function progressInScene( scene )
    {
        //console.log('progress in scene: ', scene)
    }

    var prevValue2 = 0;

    function turnOpacityOffExcept( idArray )
    {
        $('.section-tranz').each(function(){
            if (this.style.opacity>0)
            {
                //onsole.log('this: ', this);
                if (idArray.indexOf(this.id)>=0) {
                    //exclude this one
                } else {
                    this.style.opacity = 0;
                }
            }
        });
    }
    var timeStamp = 0;
    var steps = [
        { // 0
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        },
        { // 1
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 2
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 3
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 4
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 5
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 6
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 7
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 8
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 9
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 10
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 11
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 12
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
        ,
        { // 13
            anim1:null,
            anim2:null,
            anim3:null,
            anim4:null,
            anim5:null
        }
    ];

    var tweeningPageAvailable = true;
    var pageTween = null;

    function gotoPageAndFade ( goTo, goFrom, spe )
    {
        //console.log('trying to go to page: ', goTo);
        var btnUp = document.getElementById('btnUp');
        var btnDown = document.getElementById('btnDown');

        //var pag2bg = parseInt(document.getElementById('pag2').style.top.split('px')[0]);

        //if (goTo>=2 && pag2bg<0) document.getElementById('pag2').style.top = '0px';

        if (goTo >= 1 && btnUp.style.opacity<0.65) 
        {
            btnUp.style.opacity = 0.65;
            btnUp.style.pointerEvents = 'auto';
        }
        if (goTo < 1 && btnUp.style.opacity>0) {
            btnUp.style.opacity = 0;
            btnUp.style.pointerEvents = 'none';
        }

        //console.log('goTo: ', goTo, 'slides-1: ', slides.length-1);
        if (goTo == slides.length-1 && btnDown.style.opacity>0) {
            btnDown.style.opacity = 0;
            btnDown.style.pointerEvents = 'none';
        }

        if (goTo < slides.length-1 && btnDown.style.opacity<0.65) {
            btnDown.style.opacity = 0.65;
            btnDown.style.pointerEvents = 'auto';  
        } 

        var sectionIdTo = 'pag'+(goTo+1);
        var sectionIdFrom = 'pag'+(goFrom+1);
        //console.log('section to scroll to, from: ', $('#'+sectionIdTo), $('#'+sectionIdFrom));
        var d = slidesScenes[goTo].scrollOffset();

        //console.log('d: ', slidesScenes[goTo].scrollOffset());
        //var topPos = d.offsetTop;
        //scrollMagicController.scrollTo(sectionIdTo);
        var scrollDist = goTo * window.innerHeight ;
       // console.log('scroll dist: ', scrollDist) ;

        //var scrollFrom = {y: document.documentElement.scrollTop};
        var scrollFrom = {y: window.scrollY};
        if (window.pageYOffset) scrollFrom.y = window.pageYOffset;
        //console.log('scrolling from: ', scrollFrom, ' to ', d);
        tweeningPageAvailable = false;
        //console.log('pageTween: ', pageTween);
        if (pageTween) {
            pageTween.stop();
            pageTween = null;
            return false;
        } else {
            var speed = 1000;
            var ease = TWEEN.Easing.Quadratic.InOut;
            if (rloop.portrait) speed = 1500;
            if (spe) speed = spe;
            //console.log('starting tween!!', rloop.mobile);
             if (rloop.mobile) {
                // /console.log('should be scrolling to: ', myScroll )
                //console.log('trying to scroll to on mobile: ', - d );
                myScroll.scrollTo(0, - d, 1000);
                    
            } else {
                pageTween = new TWEEN.Tween(scrollFrom)
                 .to({y:d}, speed)
                 .easing( ease )
                 .onUpdate(function(){
                    //console.log('updating...', rloop.mobile)
                    //if (rloop.portrait) window.scrollTo(parseInt(this._object.y), 0);
                    //else                 
                   
                    window.setTimeout(scrollToValue.bind(null, this._object.y), 0);
                    
                    //window.scrollTo(0, this._object.y);
                    // if (rloop.mobile) {
                    //     document.body.scrollTop(this._object.y;
                    //     console.log('offset: ', window.pageYOffset) ;
                    // } 
                    //setTimeout(scrollToValue(this._object.y), 10);
                        
                    
                    //console.log('window.scrollTo: ', window.scrollTo)
                 })
                 .onComplete(function(){
                    pageTween = null;
                 })
                 .start();
             }

            return true;
        }
        // if (window.history && window.history.pushState) {
        //     history.pushState("", document.title, sectionIdTo);
        // }
    }

    //function scroll

    function scrollToValue(val)
    {
        // if($('body').scrollTop()!=val){
        //     $('body').scrollTop(val);         //Chrome,Safari
        // }else{
        //     if($('html').scrollTop()!=val){    //IE, FF
        //         $('html').scrollTop(val);
        //     }
        // } 
        //console.log('scrollting controller to: ', val);
        scrollMagicController.scrollTo(val);
        //scrollMagicController.update();
        //window.scrollTo(0, val);
    }

    var neededActive = ['0','0','0','0'];
    function sliderUpdate ( event )
    {
        //groupA.removeAll();

        var sectionHeight = $(event.target.triggerElement())[0].clientHeight;
        //console.log('event: ', event.scrollPos, sectionHeight);
        //var currentStage = parseInt($(e.target.triggerElement()).attr('id').split('pag')[1]) - 1;
        var scrollPercentInStage = (event.scrollPos - sectionHeight*currentStage) / sectionHeight;
        if (rloop.mobile ) scrollPercentInStage = Math.abs((-event.scrollPos + sectionHeight*currentStage) / sectionHeight);
        var dif = event.scrollPos - prevValue2
        var direction = (dif > 0) ? 'down' : 'up';
        prevValue2 = event.scrollPos;
        //console.log('direction: ', direction);
        //console.log('current stage: ', currentStage, ' triggered by: ', $(event.target.triggerElement())[0].id)
        $('.section-tranz').each(function(){
            if (this.style.opacity>0 && this.style.opacity<1)
            {
                //this.style.opacity = 0;
                // console.log('this: ', this);
                // if (idArray.indexOf(this.id)>=0) {
                //     //exclude this one
                // } else {
                //     this.style.opacity = 0;
                // }
            }
        });



        //console.log(currentStage , ' ---- ', scrollPercentInStage);
        
        switch (currentStage)
        {
            case 0:
                //console.log(scrollPercentInStage)
                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 1 && rloop.animationStep <= 2 && direction=='up')
                    {
                        rloop.animationStep = 1;
                        neededActive = ['mainTxt', 'txtTitl'];
                        if (steps[0].anim1) steps[0].anim1.stop();
                        steps[0].anim1 = tweenOpacityTo('txtTitl', 0, 0).start().onComplete(function(){steps[0].anim1 = null});
                        neededActive[0] = '0';
                        tweenToGeometryFromRandom(rloop.geometriesArray[1]);
                        //return;
                    }
                }

                if (scrollPercentInStage<0.7 && direction=='up')
                {
                    if (rloop.animationStep > 2)
                    {
                        //console.log('one')
                        rloop.animationStep = 2;
                        executeAfterExitCircle();
                        neededActive = ['mainTxt', 'txtTitl'];
                        if (steps[0].anim2) steps[0].anim2.stop();
                        steps[0].anim2 = tweenOpacityTo('mainTxt', 0, 0).start().onComplete(function(){steps[0].anim2 = null});
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToNewGeometry(rloop.geometriesArray[1]);
                        //return;
                    }
                }

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6 && direction=='down') 
                {
                    if (rloop.animationStep < 2)
                    {
                        rloop.animationStep = 2;
                        neededActive = ['mainTxt', 'txtTitl', 'pre-block'];
                        if (steps[0].anim1) steps[0].anim1.stop();
                        steps[0].anim1 = tweenOpacityTo('txtTitl', 1, 0).start().onComplete(function(){steps[0].anim1 = null});
                        tweenOpacityTo('pre-block', 0, 100).start();
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToNewGeometry(rloop.geometriesArray[2]); 
                        //return;                           
                    }                    
                }

                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<2.1 && direction=='down')
                    {
                        rloop.animationStep = 2.1;
                        neededActive = ['mainTxt', 'txtTitl', 'pre-block'];
                        if (steps[0].anim2) steps[0].anim2.stop();
                        steps[0].anim2 = tweenOpacityTo('mainTxt', 1, 0).start().onComplete(function(){steps[0].anim2 = null});
                        
                        //coinObject.rotation.y = -Math.PI/14;
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, new THREE.Vector3(0,-Math.PI/14,0));
                        executeAfterLoadingCircle();
                        tweenToGeometryFromRandom(rloop.geometriesArray[2],0, null);
                        //return;
                    }
                }
                break;


            case 1:
                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 2.1 && rloop.animationStep <= 3 && direction=='up')
                    {
                        rloop.animationStep = 2.1;
                        neededActive = ['txtTitl', 'mainTxt' , 'txtTitl3', '0' ]
                        if (steps[0].anim1) steps[0].anim1.stop();
                        steps[0].anim1 = tweenOpacityTo('txtTitl', 1, 0).start().onComplete(function(){steps[0].anim1 = null});
                        
                        if (steps[0].anim2) steps[0].anim2.stop();
                        steps[0].anim2 = tweenOpacityTo('mainTxt', 1, 0).start().onComplete(function(){steps[0].anim2 = null});

                        if (steps[1].anim1) steps[1].anim1.stop();
                        steps[1].anim1 = tweenOpacityTo('txtTitl3', 0, 0).start().onComplete(function(){steps[1].anim1 = null});

                        var fPartRot = new THREE.Vector3(0,-Math.PI/14,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, fPartRot);
                        executeAfterLoadingCircle();
                        tweenToGeometryFromRandom(rloop.geometriesArray[2],0, null);
                        //return;
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 3 && direction=='up')
                    {
                        rloop.animationStep = 3;

                         if (steps[0].anim2) steps[0].anim2.stop();
                        steps[0].anim2 = tweenOpacityTo('mainTxt', 0, 0).start().onComplete(function(){steps[0].anim2 = null});
                         neededActive = ['txtTitl3', 'mainTxt' , 'bottomTxt3', 'mainTxt3' ]
                         if (steps[1].anim2) steps[1].anim2.stop();
                        steps[1].anim2 = tweenOpacityTo('mainTxt3', 0, 0).start().onComplete(function(){steps[1].anim2 = null});

                        if (steps[1].anim3) steps[1].anim3.stop();
                        steps[1].anim3 = tweenOpacityTo('bottomTxt3', 0, 0).start().onComplete(function(){steps[1].anim3 = null});

                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToNewGeometry(rloop.geometriesArray[2]);
                        //return;
                    }
                }                

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 3 && direction=='down')
                    {
                        //console.log('here: ', rloop.animationStep)
                        rloop.animationStep = 3;
                        executeAfterExitCircle();
                        neededActive = ['txtTitl3', 'txtTitl' , 'mainTxt', '0' ]
                         if (steps[0].anim2) steps[0].anim2.stop();
                        steps[0].anim2 = tweenOpacityTo('mainTxt', 0, 0).start().onComplete(function(){steps[0].anim2 = null});

                        if (steps[0].anim1) steps[0].anim1.stop();
                        steps[0].anim1 = tweenOpacityTo('txtTitl', 0, 0).start().onComplete(function(){steps[0].anim1 = null});

                        if (steps[1].anim1) steps[1].anim1.stop();
                        steps[1].anim1 = tweenOpacityTo('txtTitl3', 1, 0).start().onComplete(function(){steps[1].anim1 = null});

                        tweenToNewGeometry(rloop.geometriesArray[3]); 
                        //return;                           
                    }                    
                }

                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<3.1 && direction=='down')
                    {          
                        rloop.animationStep = 3.1; 
                        executeAfterExitCircle();
                        neededActive = ['txtTitl3', 'mainTxt3' , 'bottomTxt3', '0' ];
                        if (steps[1].anim2) steps[1].anim2.stop();
                        steps[1].anim2 = tweenOpacityTo('mainTxt3', 1, 0).start().onComplete(function(){steps[1].anim2 = null});

                        if (steps[1].anim3) steps[1].anim3.stop();
                        steps[1].anim3 = tweenOpacityTo('bottomTxt3', 1, 0).start().onComplete(function(){steps[1].anim3 = null});
                        
                        var fPartPoz = new THREE.Vector3(11,-2,-7);
                        var fPartRot = new THREE.Vector3(0,-Math.PI/14,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        tweenToGeometryFromRandom(rloop.geometriesArray[3],0, null);
                        //return;
                    }
                }
                break;

            case 2:
                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 3.1 && rloop.animationStep <= 4 && direction=='up')
                    {
                        rloop.animationStep = 3.1;
                        neededActive = ['txtTitl3', 'mainTxt3' , 'bottomTxt3', 'txtTitl4' ];
                        if (steps[1].anim1) steps[1].anim1.stop();
                        steps[1].anim1 = tweenOpacityTo('txtTitl3', 1, 0).start().onComplete(function(){steps[1].anim1 = null});

                        if (steps[1].anim2) steps[1].anim2.stop();
                        steps[1].anim2 = tweenOpacityTo('mainTxt3', 1, 0).start().onComplete(function(){steps[1].anim2 = null});

                        if (steps[1].anim3) steps[1].anim3.stop();
                        steps[1].anim3 = tweenOpacityTo('bottomTxt3', 1, 0).start().onComplete(function(){steps[1].anim3 = null});

                        if (steps[2].anim1) steps[2].anim1.stop();
                        steps[2].anim1 = tweenOpacityTo('txtTitl4', 0, 0).start().onComplete(function(){steps[2].anim1 = null});
                        
                        var fPartPoz = new THREE.Vector3(11,-2,-7);
                        var fPartRot = new THREE.Vector3(0,-Math.PI/14,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        tweenToGeometryFromRandom(rloop.geometriesArray[3],0,null);
                        //return;
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 4 && direction=='up')
                    {
                        rloop.animationStep = 4;
                        tweenIconsOut();
                        neededActive = ['txtTitl3', 'mainTxt3' , 'mainTxt4', 'bottomTxt4', 'txtTitl4', 'watchVideoBtn'];
                        if (steps[1].anim2) steps[1].anim2.stop();                        
                        steps[1].anim2 = tweenOpacityTo('mainTxt3', 0, 0).start().onComplete(function(){steps[1].anim2 = null});

                        if (steps[2].anim2) steps[2].anim2.stop();
                        steps[2].anim2 = tweenOpacityTo('mainTxt4', 0, 0).start().onComplete(function(){steps[2].anim2 = null});

                        if (steps[2].anim3) steps[2].anim3.stop();
                        steps[2].anim3 = tweenOpacityTo('bottomTxt4', 0, 0).start().onComplete(function(){steps[2].anim3 = null});

                        if (steps[2].anim4) steps[2].anim4.stop();
                        steps[2].anim4 = tweenOpacityTo('watchVideoBtn', 0, 0).start().onComplete(function(){steps[2].anim4 = null});

                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToNewGeometry(rloop.geometriesArray[3]);
                        //return;
                    }
                }   

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 4 && direction=='down')
                    {
                        rloop.animationStep = 4;
                        neededActive = ['txtTitl4', 'txtTitl3' , 'mainTxt3', 'bottomTxt3' ];
                        if (steps[1].anim1) steps[1].anim1.stop();
                        steps[1].anim1 = tweenOpacityTo('txtTitl3', 0, 0).start().onComplete(function(){steps[1].anim1 = null});

                        if (steps[1].anim2) steps[1].anim2.stop();                        
                        steps[1].anim2 = tweenOpacityTo('mainTxt3', 0, 0).start().onComplete(function(){steps[1].anim2 = null});

                        if (steps[1].anim3) steps[1].anim3.stop();
                        steps[1].anim3 = tweenOpacityTo('bottomTxt3', 0, 0).start().onComplete(function(){steps[1].anim3 = null});

                        if (steps[2].anim1) steps[2].anim1.stop();
                        steps[2].anim1 = tweenOpacityTo('txtTitl4', 1, 0).start().onComplete(function(){steps[2].anim1 = null});

                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);                        
                        tweenToNewGeometry(rloop.geometriesArray[4]); 
                        //return;
                    }
                }
                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<4.1 && direction=='down')
                    {          
                        rloop.animationStep = 4.1; 
                        neededActive = ['txtTitl4', 'mainTxt4' , 'bottomTxt4', 'watchVideoBtn' ];
                        if (steps[2].anim2) steps[2].anim2.stop();                        
                        steps[2].anim2 = tweenOpacityTo('mainTxt4', 1, 0).start().onComplete(function(){steps[2].anim2 = null});

                        if (steps[2].anim3) steps[2].anim3.stop();
                        steps[2].anim3 = tweenOpacityTo('bottomTxt4', 1, 0).start().onComplete(function(){steps[2].anim3 = null});

                        if (steps[2].anim4) steps[2].anim4.stop();
                        steps[2].anim4 = tweenOpacityTo('watchVideoBtn', 1, 0).start().onComplete(function(){steps[2].anim4 = null});

                        var fPartPoz = new THREE.Vector3(9,-2,-7);
                        //var fPartRot = new THREE.Vector3(0,-Math.PI/14,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, bufferInitialRotation);
                        //cu middlepoint poate mai tarziu
                        var middlePoint = getMiddlePointGeom4(rloop.geometriesArray[4], fPartPoz);                        
                        //tweenToGeometryFromRandom(middlePoint,0, executeAfterMiddlePoint, false );
                        tweenToGeometryFromRandom(rloop.geometriesArray[4],0, null, false );
                        //return;
                    }
                }
                break;

            case 3:

                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 4.1 && rloop.animationStep <= 5 && direction=='up')
                    {
                        rloop.animationStep = 4.1;
                        //neededActive = ['txtTitl4', 'mainTxt4' , 'bottomTxt4', '0' ];
                        neededActive = [ 'txtTitl4' , 'mainTxt4', 'bottomTxt4', 'watchVideoBtn' ];
                        if (steps[2].anim1) steps[2].anim1.stop();
                        steps[2].anim1 = tweenOpacityTo('txtTitl4', 1, 0).start().onComplete(function(){steps[2].anim1 = null});

                        if (steps[2].anim2) steps[2].anim2.stop();                        
                        steps[2].anim2 = tweenOpacityTo('mainTxt4', 1, 0).start().onComplete(function(){steps[2].anim2 = null});

                        if (steps[2].anim3) steps[2].anim3.stop();
                        steps[2].anim3 = tweenOpacityTo('bottomTxt4', 1, 0).start().onComplete(function(){steps[2].anim3 = null});

                        if (steps[2].anim4) steps[2].anim4.stop();
                        steps[2].anim4 = tweenOpacityTo('watchVideoBtn', 1, 0).start().onComplete(function(){steps[2].anim4 = null});

                        if (steps[3].anim1) steps[3].anim1.stop();
                        steps[3].anim1 = tweenOpacityTo('txtTitl5', 0, 0).start().onComplete(function(){steps[3].anim1 = null});



                        var fPartPoz = new THREE.Vector3(9,-2,-7);   
                        getMiddlePointGeom4(rloop.geometriesArray[4], fPartPoz);                       
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, bufferInitialRotation);
                        tweenToGeometryFromRandom(rloop.geometriesArray[4],0,null);
                        //return;
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 5 && direction=='up')
                    {
                        rloop.animationStep = 5;
                        neededActive = ['txtTitl5', 'mainTxt4' , 'bottomTxt5', 'mainTxt5' , 'onePagerBtn'];
                        if (steps[2].anim2) steps[2].anim2.stop();                        
                        steps[2].anim2 = tweenOpacityTo('mainTxt4', 0, 0).start().onComplete(function(){steps[2].anim2 = null});

                        if (steps[3].anim2) steps[3].anim2.stop();                        
                        steps[3].anim2 = tweenOpacityTo('mainTxt5', 0, 0).start().onComplete(function(){steps[3].anim2 = null});

                        if (steps[3].anim3) steps[3].anim3.stop();
                        steps[3].anim3 = tweenOpacityTo('bottomTxt5', 0, 0).start().onComplete(function(){steps[3].anim3 = null});

                        if (steps[3].anim4) steps[3].anim4.stop();
                        steps[3].anim4 = tweenOpacityTo('onePagerBtn', 0, 0).start().onComplete(function(){steps[3].anim4 = null});

                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToNewGeometry(rloop.geometriesArray[4]);
                        //return;
                    }
                }   

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 5 && direction=='down')
                    {
                        rloop.animationStep = 5;
                        tweenIconsOut();
                        neededActive = ['txtTitl5', 'txtTitl4' , 'mainTxt4', 'bottomTxt4', 'watchVideoBtn', 'onePagerBtn' ];
                        if (steps[2].anim1) steps[2].anim1.stop();
                        steps[2].anim1 = tweenOpacityTo('txtTitl4', 0, 0).start().onComplete(function(){steps[2].anim1 = null});

                        if (steps[2].anim2) steps[2].anim2.stop();                        
                        steps[2].anim2 = tweenOpacityTo('mainTxt4', 0, 0).start().onComplete(function(){steps[2].anim2 = null});

                        if (steps[2].anim3) steps[2].anim3.stop();
                        steps[2].anim3 = tweenOpacityTo('bottomTxt4', 0, 0).start().onComplete(function(){steps[2].anim3 = null});

                        if (steps[3].anim4) steps[3].anim4.stop();
                        steps[3].anim4 = tweenOpacityTo('onePagerBtn', 0, 0).start().onComplete(function(){steps[3].anim4 = null});

                        if (steps[2].anim4) steps[2].anim4.stop();
                        steps[2].anim4 = tweenOpacityTo('watchVideoBtn', 0, 0).start().onComplete(function(){steps[2].anim4 = null});

                        if (steps[3].anim1) steps[3].anim1.stop();
                        steps[3].anim1 = tweenOpacityTo('txtTitl5', 1, 0).start().onComplete(function(){steps[3].anim1 = null});

                        tweenOpacityTo('txtTitl5', 1, 0).start();
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToNewGeometry(rloop.geometriesArray[5]); 
                        //return;
                    }
                }
                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<5.1 && direction=='down')
                    {          
                        rloop.animationStep = 5.1; 
                        tweenIconsOut();
                        neededActive = ['txtTitl5', 'mainTxt5' , 'bottomTxt5', 'onePagerBtn' ];
                        if (steps[3].anim2) steps[3].anim2.stop();                        
                        steps[3].anim2 = tweenOpacityTo('mainTxt5', 1, 0).start().onComplete(function(){steps[3].anim2 = null});

                        if (steps[3].anim3) steps[3].anim3.stop();
                        steps[3].anim3 = tweenOpacityTo('bottomTxt5', 1, 0).start().onComplete(function(){steps[3].anim3 = null});

                        if (steps[3].anim4) steps[3].anim4.stop();
                        steps[3].anim4 = tweenOpacityTo('onePagerBtn', 1, 0).start().onComplete(function(){steps[3].anim4 = null});

                        var fPartPoz = new THREE.Vector3(12,-2,-7);
                        var fPartRot = new THREE.Vector3(0,-Math.PI/14,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, bufferInitialRotation);
                        tweenToGeometryFromRandom(rloop.geometriesArray[5],0, null);
                        //return;
                    }
                }
                break;

            case 4:

                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 5.1 && rloop.animationStep <= 6 && direction=='up')
                    {
                        rloop.animationStep = 5.1;
                        neededActive = ['txtTitl5', 'mainTxt5' , 'bottomTxt5', 'txtTitl6', 'onePagerBtn' ];
                        if (steps[3].anim1) steps[3].anim1.stop();
                        steps[3].anim1 = tweenOpacityTo('txtTitl5', 1, 0).start().onComplete(function(){steps[3].anim1 = null});

                        if (steps[3].anim2) steps[3].anim2.stop();                        
                        steps[3].anim2 = tweenOpacityTo('mainTxt5', 1, 0).start().onComplete(function(){steps[3].anim2 = null});

                        if (steps[3].anim3) steps[3].anim3.stop();
                        steps[3].anim3 = tweenOpacityTo('bottomTxt5', 1, 0).start().onComplete(function(){steps[3].anim3 = null});

                        if (steps[3].anim4) steps[3].anim4.stop();
                        steps[3].anim4 = tweenOpacityTo('onePagerBtn', 1, 0).start().onComplete(function(){steps[3].anim4 = null});

                        if (steps[4].anim1) steps[4].anim1.stop();
                        steps[4].anim1 = tweenOpacityTo('txtTitl6', 0, 0).start().onComplete(function(){steps[4].anim1 = null});

                        var fPartPoz = new THREE.Vector3(12,-2,-7);
                        var fPartRot = new THREE.Vector3(0,-Math.PI/14,0);                     
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        tweenToGeometryFromRandom(rloop.geometriesArray[5],0,null);
                        var randomFactor = 5;
                        //tweenToNewGeometry(rloop.geometriesArray[6],0, randomFactor); 
                        //return;
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 6 && direction=='up')
                    {
                        rloop.animationStep = 6;
                        //tweenIconsOut();
                        if (steps[3].anim2) steps[3].anim2.stop();                        
                        steps[3].anim2 = tweenOpacityTo('mainTxt5', 0, 0).start().onComplete(function(){steps[3].anim2 = null});
                        neededActive = ['txtTitl5', 'mainTxt5' , 'mainTxt6', 'txtTitl6' ];
                        if (steps[4].anim2) steps[4].anim2.stop();                        
                        steps[4].anim2 = tweenOpacityTo('mainTxt6', 0, 0).start().onComplete(function(){steps[4].anim2 = null});
                        tweenIconsOutStep2_1();
                        var fPartPoz = new THREE.Vector3(-45,-23,-100);                        
                        var fPartRot = new THREE.Vector3(0,0,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        var randomFactor = 5;
                        //tweenToNewGeometry(rloop.geometriesArray[5],0, randomFactor);
                        //return;
                    }
                }  

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 6 && direction=='down')
                    {
                        rloop.animationStep = 6;
                        tweenIconsOut();
                        neededActive = ['txtTitl6', 'txtTitl5' , 'mainTxt5', 'bottomTxt5', 'onePagerBtn' ];
                        if (steps[3].anim1) steps[3].anim1.stop();
                        steps[3].anim1 = tweenOpacityTo('txtTitl5', 0, 0).start().onComplete(function(){steps[3].anim1 = null});

                        if (steps[3].anim2) steps[3].anim2.stop();                        
                        steps[3].anim2 = tweenOpacityTo('mainTxt5', 0, 0).start().onComplete(function(){steps[3].anim2 = null});

                        if (steps[3].anim3) steps[3].anim3.stop();
                        steps[3].anim3 = tweenOpacityTo('bottomTxt5', 0, 0).start().onComplete(function(){steps[3].anim3 = null});

                        if (steps[3].anim4) steps[3].anim4.stop();
                        steps[3].anim4 = tweenOpacityTo('onePagerBtn', 0, 0).start().onComplete(function(){steps[3].anim4 = null});

                        if (steps[4].anim1) steps[4].anim1.stop();
                        steps[4].anim1 = tweenOpacityTo('txtTitl6', 1, 0).start().onComplete(function(){steps[4].anim1 = null});
                        
                        var randomFactor = 5;
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToNewGeometry(rloop.geometriesArray[6],0, randomFactor); 
                        //return;
                    }
                }
                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<6.1 && direction=='down')
                    {          
                        rloop.animationStep = 6.1; 
                        //turnOpacityOffExcept(['mainTxt5','bottomTxt5'])
                        neededActive = ['txtTitl6', 'mainTxt6' , '0', '0' ];
                        if (steps[4].anim2) steps[4].anim2.stop();                        
                        steps[4].anim2 = tweenOpacityTo('mainTxt6', 1, 0).start().onComplete(function(){steps[4].anim2 = null});
                        
                        var fPartPoz = new THREE.Vector3(-45,-23,-100);
                        iconObjectStep2.position.x =fPartPoz.x;
                        iconObjectStep2.position.y =fPartPoz.y;
                        iconObjectStep2.position.z =fPartPoz.z;
                        var fPartRot = new THREE.Vector3(0,0,0);
                        tweenIconsInStep2_1();
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, bufferInitialRotation);
                        //tweenToGeometryFromRandom(rloop.geometriesArray[6],0, null);
                        //return;
                    }
                }
                break;

            case 5:

                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 6.1 && rloop.animationStep <= 7 && direction=='up')
                    {
                        rloop.animationStep = 6.1;
                        neededActive = ['txtTitl6', 'mainTxt6' , '0', '0' ];
                        if (steps[4].anim1) steps[4].anim1.stop();
                        steps[4].anim1 = tweenOpacityTo('txtTitl6', 1, 0).start().onComplete(function(){steps[4].anim1 = null});

                        if (steps[4].anim2) steps[4].anim2.stop();                        
                        steps[4].anim2 = tweenOpacityTo('mainTxt6', 1, 0).start().onComplete(function(){steps[4].anim2 = null});                       
                        var fPartPoz = new THREE.Vector3(-45,-23,-100);                        
                        var fPartRot = new THREE.Vector3(0,0,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        var randomFactor = 5;
                        tweenToNewGeometry(rloop.geometriesArray[6],0, randomFactor); 
                        //return;
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 7 && direction=='up')
                    {
                        rloop.animationStep = 7;
                        neededActive = ['mainTxt6', 'mainTxt7' , '0', '0' ];
                        if (steps[4].anim2) steps[4].anim2.stop();                        
                        steps[4].anim2 = tweenOpacityTo('mainTxt6', 0, 0).start().onComplete(function(){steps[4].anim2 = null});
                        

                        if (steps[5].anim2) steps[5].anim2.stop();                        
                        steps[5].anim2 = tweenOpacityTo('mainTxt7', 0, 0).start().onComplete(function(){steps[5].anim2 = null});
                        tweenIconsOutStep2_2();
                        //tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToGeometryFromRandom(rloop.geometriesArray[6],0, null, false, false);
                        //return;
                    }
                }  

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 7 && direction=='down')
                    {
                        rloop.animationStep = 7;
                        neededActive = ['txtTitl6', 'mainTxt6' , '0', '0' ];
                        if (steps[4].anim1) steps[4].anim1.stop();
                        steps[4].anim1 = tweenOpacityTo('txtTitl6', 0, 0).start().onComplete(function(){steps[4].anim1 = null});

                        if (steps[4].anim2) steps[4].anim2.stop();                        
                        steps[4].anim2 = tweenOpacityTo('mainTxt6', 0, 0).start().onComplete(function(){steps[4].anim2 = null});
                     
                        tweenToGeometryFromRandom(rloop.geometriesArray[6],0, null, false, true);
                        //return;
                    }
                }
                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<7.1 && direction=='down')
                    {          
                        neededActive = ['0', 'mainTxt7' , '0', '0' ];
                        rloop.animationStep = 7.1; 
                        if (steps[5].anim2) steps[5].anim2.stop(); 
                        tweenIconsInStep2_2();                       
                        steps[5].anim2 = tweenOpacityTo('mainTxt7', 1, 0).start().onComplete(function(){steps[5].anim2 = null});                        
                        var fPartPoz = new THREE.Vector3(-45,-23,-100);
                        iconObjectStep2.position.x =fPartPoz.x;
                        iconObjectStep2.position.y =fPartPoz.y;
                        iconObjectStep2.position.z =fPartPoz.z;
                        var fPartRot = new THREE.Vector3(0,0,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, bufferInitialRotation);
                        //tweenToNewGeometry(rloop.geometriesArray[7],0); 
                        //var temp = createGeomFromImageData(loadedSteps[imageSteps[6]].imgData, 1.8, true);
                        //el = addTwoGeometries(rloop.geometriesArray[6], temp, 37);
                        //rloop.geometriesArray[7] = addTwoGeometries(rloop.geometriesArray[6], temp, 37);
                        tweenToGeometryFromRandom(rloop.geometriesArray[7],0, null);
                        //return;
                    }
                }
                break;

            case 6:

                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 7.1 && rloop.animationStep <= 8 && direction=='up')
                    {
                        rloop.animationStep = 7.1;
                        neededActive = ['0', 'mainTxt7' , '0', '0' ];
                        if (steps[5].anim2) steps[5].anim2.stop();                        
                        steps[5].anim2 = tweenOpacityTo('mainTxt7', 1, 0).start().onComplete(function(){steps[5].anim2 = null});                        
                        tweenToGeometryFromRandom(rloop.geometriesArray[7],0, null, false, false);
                        //return;
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 8 && direction=='up')
                    {
                        rloop.animationStep = 8;

                        if (steps[5].anim2) steps[5].anim2.stop();                        
                        steps[5].anim2 = tweenOpacityTo('mainTxt7', 0, 0).start().onComplete(function(){steps[5].anim2 = null});
                        neededActive = ['mainTxt7', 'mainTxt8' , '0', '0' ];
                        if (steps[6].anim2) steps[6].anim2.stop();                        
                        steps[6].anim2 = tweenOpacityTo('mainTxt8', 0, 0).start().onComplete(function(){steps[6].anim2 = null});
                        tweenIconsOutStep2_3();
                        //tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        //tweenToGeometryFromRandom(rloop.geometriesArray[6],0, null, false, false);
                        //return;
                    }
                }  

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 8 && direction=='down')
                    {
                        rloop.animationStep = 8;  
                        neededActive = ['0', 'mainTxt7' , '0', '0' ];                      
                        if (steps[5].anim2) steps[5].anim2.stop();                        
                        steps[5].anim2 = tweenOpacityTo('mainTxt7', 0, 0).start().onComplete(function(){steps[5].anim2 = null});
                        
                        tweenToGeometryFromRandom(rloop.geometriesArray[8],0, null, false, true);
                        //return;
                    }
                }

                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<8.1 && direction=='down')
                    {          
                        rloop.animationStep = 8.1; 
                        tweenIconsInStep2_3();    
                        neededActive = ['0', 'mainTxt8' , '0', '0' ];
                        if (steps[6].anim2) steps[6].anim2.stop();                                           
                        steps[6].anim2 = tweenOpacityTo('mainTxt8', 1, 0).start().onComplete(function(){steps[6].anim2 = null});
                        
                        //tweenToGeometryFromRandom(rloop.geometriesArray[8],0, null);
                        //return;
                    }
                }
                break;
            case 7:

                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 8.1 && rloop.animationStep <= 9 && direction=='up')
                    {
                        rloop.animationStep = 8.1;
                        neededActive = ['0', 'mainTxt8' , '0', '0' ];
                        if (steps[6].anim2) steps[6].anim2.stop();                        
                        steps[6].anim2 = tweenOpacityTo('mainTxt8', 1, 0).start().onComplete(function(){steps[6].anim2 = null});                        
                        tweenToGeometryFromRandom(rloop.geometriesArray[8],0, null, false, false);
                        //return;
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 9 && direction=='up')
                    {
                        rloop.animationStep = 9;
                        neededActive = ['mainTxt8', 'mainTxt9' , '0', '0' ];
                        if (steps[6].anim2) steps[6].anim2.stop();                        
                        steps[6].anim2 = tweenOpacityTo('mainTxt8', 0, 0).start().onComplete(function(){steps[6].anim2 = null});

                        if (steps[7].anim2) steps[7].anim2.stop();                        
                        steps[7].anim2 = tweenOpacityTo('mainTxt9', 0, 0).start().onComplete(function(){steps[7].anim2 = null});
                        tweenIconsOutStep2_4();                       
                        //return;
                    }
                }  

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 9 && direction=='down')
                    {
                        rloop.animationStep = 9;
                        neededActive = ['0', 'mainTxt8' , '0', '0' ];
                        if (steps[6].anim2) steps[6].anim2.stop();                        
                        steps[6].anim2 = tweenOpacityTo('mainTxt8', 0, 0).start().onComplete(function(){steps[6].anim2 = null});
                        
                        tweenToGeometryFromRandom(rloop.geometriesArray[9],0, null, false, true);
                        //return;
                    }
                }

                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<9.1 && direction=='down')
                    {          
                        rloop.animationStep = 9.1;
                        neededActive = ['0', 'mainTxt9' , '0', '0' ];
                        tweenIconsInStep2_4();
                        if (steps[7].anim2) steps[7].anim2.stop();                                           
                        steps[7].anim2 = tweenOpacityTo('mainTxt9', 1, 0).start().onComplete(function(){steps[7].anim2 = null});                        
                        //return;
                    }
                }
                break;

            case 8:

                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 9.1 && rloop.animationStep <= 10 && direction=='up')
                    {
                        rloop.animationStep = 9.1;
                        neededActive = ['txtTitl10', 'mainTxt9' , '0', '0' ];
                        if (steps[7].anim2) steps[7].anim2.stop();                        
                        steps[7].anim2 = tweenOpacityTo('mainTxt9', 1, 0).start().onComplete(function(){steps[7].anim2 = null});                        

                        if (steps[8].anim1) steps[8].anim1.stop();
                        steps[8].anim1 = tweenOpacityTo('txtTitl10', 0, 0).start().onComplete(function(){steps[8].anim1 = null});
                        var fPartPoz = new THREE.Vector3(-45,-23,-100);                        
                        var fPartRot = new THREE.Vector3(0,0,0);
                        tweenIconsInAllStep2();
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        tweenToGeometryFromRandom(rloop.geometriesArray[9],0, null, false, false);
                        //return;
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 10 && direction=='up')
                    {
                        rloop.animationStep = 10;
                        neededActive = ['txtTitl10', 'mainTxt9' , 'mainTxt10', 'bottomTxt10', 'roadmapBtn'];
                        if (steps[7].anim2) steps[7].anim2.stop();                        
                        steps[7].anim2 = tweenOpacityTo('mainTxt9', 0, 0).start().onComplete(function(){steps[7].anim2 = null});

                        if (steps[8].anim2) steps[8].anim2.stop();                        
                        steps[8].anim2 = tweenOpacityTo('mainTxt10', 0, 0).start().onComplete(function(){steps[8].anim2 = null});

                        if (steps[8].anim3) steps[8].anim3.stop();                        
                        steps[8].anim3 = tweenOpacityTo('bottomTxt10', 0, 0).start().onComplete(function(){steps[8].anim3 = null});

                        if (steps[8].anim4) steps[8].anim4.stop();                        
                        steps[8].anim4 = tweenOpacityTo('roadmapBtn', 0, 0).start().onComplete(function(){steps[8].anim4 = null});
                        tweenToNewGeometry(rloop.geometriesArray[9],0, 5); 
                        //return;
                    }
                }  

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 10 && direction=='down')
                    {
                        rloop.animationStep = 10;
                        neededActive = ['txtTitl10', 'mainTxt9' , '0', '0' ];
                        if (steps[7].anim2) steps[7].anim2.stop();                        
                        steps[7].anim2 = tweenOpacityTo('mainTxt9', 0, 0).start().onComplete(function(){steps[7].anim2 = null});
                        tweenIconsOutAllStep2();
                        if (steps[8].anim1) steps[8].anim1.stop();
                        steps[8].anim1 = tweenOpacityTo('txtTitl10', 1, 0).start().onComplete(function(){steps[8].anim1 = null});
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToNewGeometry(rloop.geometriesArray[10],0, 5); 
                        //return;
                    }
                }

                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<10.1 && direction=='down')
                    {          
                        rloop.animationStep = 10.1;   
                        neededActive = ['txtTitl10', 'mainTxt10' , 'bottomTxt10', 'roadmapBtn' ];                      
                        //tweenIconsInStep2_4();
                        if (steps[8].anim2) steps[8].anim2.stop();                                           
                        steps[8].anim2 = tweenOpacityTo('mainTxt10', 1, 0).start().onComplete(function(){steps[8].anim2 = null});

                        if (steps[8].anim3) steps[8].anim3.stop();                                           
                        steps[8].anim3 = tweenOpacityTo('bottomTxt10', 1, 0).start().onComplete(function(){steps[8].anim3 = null});
                        tweenIconsOutAllStep2();
                        if (steps[8].anim4) steps[8].anim4.stop();                                           
                        steps[8].anim4 = tweenOpacityTo('roadmapBtn', 1, 0).start().onComplete(function(){steps[8].anim4 = null});
                        var fPartPoz = new THREE.Vector3(35,-2,-60);
                        var fPartRot = new THREE.Vector3(0,-Math.PI/14,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        tweenToGeometryFromRandom(rloop.geometriesArray[10],0, null, false, false);                      
                        //return;
                    }
                }
                break;

            case 9:

                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 10.1 && rloop.animationStep <= 11 && direction=='up')
                    {
                        rloop.animationStep = 10.1;
                        neededActive = ['txtTitl10', 'mainTxt10' , 'bottomTxt10', 'roadmapBtn' ];
                        if (steps[8].anim3) steps[8].anim3.stop();                        
                        steps[8].anim3 = tweenOpacityTo('bottomTxt10', 1, 0).start().onComplete(function(){steps[8].anim3 = null});                      

                        if (steps[9].anim1) steps[9].anim1.stop();
                        steps[9].anim1 = tweenOpacityTo('txtTitl11', 0, 0).start().onComplete(function(){steps[9].anim1 = null});

                        if (steps[8].anim2) steps[8].anim2.stop();                        
                        steps[8].anim2 = tweenOpacityTo('mainTxt10', 1, 0).start().onComplete(function(){steps[8].anim2 = null});

                        var fPartPoz = new THREE.Vector3(35,-2,-60);
                        var fPartRot = new THREE.Vector3(0,-Math.PI/14,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        tweenToGeometryFromRandom(rloop.geometriesArray[10],0, null, false, false);
                       // return;
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 11 && direction=='up')
                    {
                        rloop.animationStep = 11;
                        neededActive = ['txtTitl11', 'mainTxt11' , 'bottomTxt11', 'txtTitl10' ];
                        if (steps[8].anim1) steps[8].anim1.stop();
                        steps[8].anim1 = tweenOpacityTo('txtTitl10', 1, 0).start().onComplete(function(){steps[8].anim1 = null});

                        if (steps[9].anim2) steps[9].anim2.stop();                        
                        steps[9].anim2 = tweenOpacityTo('mainTxt11', 0, 0).start().onComplete(function(){steps[9].anim2 = null});

                        if (steps[9].anim3) steps[9].anim3.stop();                        
                        steps[9].anim3 = tweenOpacityTo('bottomTxt11', 0, 0).start().onComplete(function(){steps[9].anim3 = null});                       
                        tweenToNewGeometry(rloop.geometriesArray[10],0, 5); 
                        //return;
                    }
                }  

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 11 && direction=='down')
                    {
                        rloop.animationStep = 11;
                        neededActive = ['txtTitl11', 'mainTxt10' , 'bottomTxt10', 'roadmapBtn' ];
                        if (steps[8].anim2) steps[8].anim2.stop();                        
                        steps[8].anim2 = tweenOpacityTo('mainTxt10', 0, 0).start().onComplete(function(){steps[8].anim2 = null});

                        if (steps[8].anim3) steps[8].anim3.stop();                        
                        steps[8].anim3 = tweenOpacityTo('bottomTxt10', 0, 0).start().onComplete(function(){steps[8].anim3 = null});

                        if (steps[8].anim4) steps[8].anim4.stop();                        
                        steps[8].anim4 = tweenOpacityTo('roadmapBtn', 0, 0).start().onComplete(function(){steps[8].anim4 = null});

                        if (steps[9].anim1) steps[9].anim1.stop();
                        steps[9].anim1 = tweenOpacityTo('txtTitl11', 1, 0).start().onComplete(function(){steps[9].anim1 = null});
                        //tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToNewGeometry(rloop.geometriesArray[11],0, 5); 
                        //return;
                    }
                }

                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<11.1 && direction=='down')
                    {          
                        rloop.animationStep = 11.1;        
                        neededActive = ['txtTitl11', 'mainTxt11' , 'bottomTxt11', 'txtTitl10' ];
                        if (steps[8].anim1) steps[8].anim1.stop();
                        steps[8].anim1 = tweenOpacityTo('txtTitl10', 0, 0).start().onComplete(function(){steps[8].anim1 = null});

                        if (steps[9].anim2) steps[9].anim2.stop();                                           
                        steps[9].anim2 = tweenOpacityTo('mainTxt11', 1, 0).start().onComplete(function(){steps[9].anim2 = null});

                        if (steps[9].anim3) steps[9].anim3.stop();                                           
                        steps[9].anim3 = tweenOpacityTo('bottomTxt11', 1, 0).start().onComplete(function(){steps[9].anim3 = null});
                       
                        var fPartPoz = new THREE.Vector3(11,0,0);
                        var fPartRot = new THREE.Vector3(-Math.PI/64,-Math.PI/6.3,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        tweenToGeometryFromRandom(rloop.geometriesArray[11],0, null, false, false);                      
                        //return;
                    }
                }
                break;

            case 10:

                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 11.1 && rloop.animationStep <= 12 && direction=='up')
                    {
                        rloop.animationStep = 11.1;
                        neededActive = ['txtTitl11', 'mainTxt11' , 'bottomTxt11', 'txtTitl12' ];          
                        if (steps[9].anim3) steps[9].anim3.stop();                        
                        steps[9].anim3 = tweenOpacityTo('bottomTxt11', 1, 0).start().onComplete(function(){steps[9].anim3 = null});  

                        if (steps[9].anim2) steps[9].anim2.stop();                        
                        steps[9].anim2 = tweenOpacityTo('mainTxt11', 1, 0).start().onComplete(function(){steps[9].anim2 = null});                    

                        if (steps[10].anim1) steps[10].anim1.stop();
                        steps[10].anim1 = tweenOpacityTo('txtTitl12', 0, 0).start().onComplete(function(){steps[10].anim1 = null});
                        var fPartPoz = new THREE.Vector3(11,0,0);
                        var fPartRot = new THREE.Vector3(-Math.PI/64,-Math.PI/6.3,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        tweenToGeometryFromRandom(rloop.geometriesArray[11],0, null, false, false);
                        //return;
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 12 && direction=='up')
                    {
                        rloop.animationStep = 12;
                        neededActive = ['txtTitl11', 'mainTxt12' , 'bottomTxt12', 'txtTitl12', 'watchVideoBtn2' ];
                        if (steps[9].anim1) steps[9].anim1.stop();
                        steps[9].anim1 = tweenOpacityTo('txtTitl11', 1, 0).start().onComplete(function(){steps[9].anim1 = null});                        
                       

                        if (steps[10].anim2) steps[10].anim2.stop();                        
                        steps[10].anim2 = tweenOpacityTo('mainTxt12', 0, 0).start().onComplete(function(){steps[10].anim2 = null});

                        if (steps[10].anim3) steps[10].anim3.stop();                        
                        steps[10].anim3 = tweenOpacityTo('bottomTxt12', 0, 0).start().onComplete(function(){steps[10].anim3 = null});

                        if (steps[10].anim4) steps[10].anim4.stop();                                           
                        steps[10].anim4 = tweenOpacityTo('watchVideoBtn2', 0, 0).start().onComplete(function(){steps[10].anim4 = null});

                        tweenToNewGeometry(rloop.geometriesArray[11],0, 3); 
                        //return;
                    }
                }  

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 12 && direction=='down')
                    {
                        rloop.animationStep = 12;
                        neededActive = ['txtTitl12', 'mainTxt11' , 'bottomTxt11', 'txtTitl12' ];
                        if (steps[9].anim2) steps[9].anim2.stop();                        
                        steps[9].anim2 = tweenOpacityTo('mainTxt11', 0, 0).start().onComplete(function(){steps[9].anim2 = null});

                        if (steps[9].anim3) steps[9].anim3.stop();                        
                        steps[9].anim3 = tweenOpacityTo('bottomTxt11', 0, 0).start().onComplete(function(){steps[9].anim3 = null});
                        
                        if (steps[10].anim1) steps[10].anim1.stop();
                        steps[10].anim1 = tweenOpacityTo('txtTitl12', 1, 0).start().onComplete(function(){steps[10].anim1 = null});
                        //tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToNewGeometry(rloop.geometriesArray[12],0, 3); 
                        //return;
                    }
                }

                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<12.1 && direction=='down')
                    {          
                        rloop.animationStep = 12.1;        
                        neededActive = ['txtTitl12', 'mainTxt12' , 'bottomTxt12', 'txtTitl11' ,' test', 'watchVideoBtn2'];
                        if (steps[9].anim1) steps[9].anim1.stop();
                        steps[9].anim1 = tweenOpacityTo('txtTitl11', 0, 0).start().onComplete(function(){steps[9].anim1 = null});

                        if (steps[10].anim2) steps[10].anim2.stop();                                           
                        steps[10].anim2 = tweenOpacityTo('mainTxt12', 1, 0).start().onComplete(function(){steps[10].anim2 = null});

                        if (steps[10].anim3) steps[10].anim3.stop();                                           
                        steps[10].anim3 = tweenOpacityTo('bottomTxt12', 1, 0).start().onComplete(function(){steps[10].anim3 = null});

                        if (steps[10].anim4) steps[10].anim4.stop();                                           
                        steps[10].anim4 = tweenOpacityTo('watchVideoBtn2', 1, 0).start().onComplete(function(){steps[10].anim4 = null});
                       
                        var fPartPoz = new THREE.Vector3(31,0,-60);
                        var fPartRot = new THREE.Vector3(-Math.PI/64,-Math.PI/6.3,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        tweenToGeometryFromRandom(rloop.geometriesArray[12],0, null, false, false);                      
                        //return;
                    }
                }

                break;

            case 11:


                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 12.1 && rloop.animationStep <= 13 && direction=='up')
                    {
                        rloop.animationStep = 12.1;
                        neededActive = ['txtTitl12', 'mainTxt12' , 'bottomTxt12', 'txtTitl13', 'watchVideoBtn2' ];         
                        if (steps[10].anim3) steps[10].anim3.stop();                        
                        steps[10].anim3 = tweenOpacityTo('bottomTxt12', 1, 0).start().onComplete(function(){steps[10].anim3 = null});   
                        tweenLogosOutStep1();
                        if (steps[10].anim2) steps[10].anim2.stop();                        
                        steps[10].anim2 = tweenOpacityTo('mainTxt12', 1, 0).start().onComplete(function(){steps[10].anim2 = null});  

                        if (steps[10].anim4) steps[10].anim4.stop();                                           
                        steps[10].anim4 = tweenOpacityTo('watchVideoBtn2', 1, 0).start().onComplete(function(){steps[10].anim4 = null});                                        

                        if (steps[11].anim1) steps[11].anim1.stop();
                        steps[11].anim1 = tweenOpacityTo('txtTitl13', 0, 0).start().onComplete(function(){steps[11].anim1 = null});
                        var fPartPoz = new THREE.Vector3(31,0,-60);
                        var fPartRot = new THREE.Vector3(-Math.PI/64,-Math.PI/6.3,0);
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        tweenToGeometryFromRandom(rloop.geometriesArray[12],0, null, false, false);
                        //return;
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 13 && direction=='up')
                    {
                        rloop.animationStep = 13;
                        neededActive = ['txtTitl12', 'mainTxt13' , 'bottomTxt13', '0' ];     
                        tweenLogosOutStep1();
                        if (steps[10].anim1) steps[10].anim1.stop();
                        steps[10].anim1 = tweenOpacityTo('txtTitl12', 1, 0).start().onComplete(function(){steps[10].anim1 = null});                                           

                        if (steps[11].anim2) steps[11].anim2.stop();                        
                        steps[11].anim2 = tweenOpacityTo('mainTxt13', 0, 0).start().onComplete(function(){steps[11].anim2 = null});

                        if (steps[11].anim3) steps[11].anim3.stop();                        
                        steps[11].anim3 = tweenOpacityTo('bottomTxt13', 0, 0).start().onComplete(function(){steps[11].anim3 = null});                       
                        //tweenToNewGeometry(rloop.geometriesArray[12],0, 3); 
                        //return;
                    }
                }  


                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 13 && direction=='down')
                    {
                        rloop.animationStep = 13;

                        neededActive = ['txtTitl13', 'mainTxt12' , 'bottomTxt12', 'watchVideoBtn2' ];     
                        if (steps[10].anim2) steps[10].anim2.stop();                        
                        steps[10].anim2 = tweenOpacityTo('mainTxt12', 0, 0).start().onComplete(function(){steps[10].anim2 = null});

                        if (steps[10].anim3) steps[10].anim3.stop();                        
                        steps[10].anim3 = tweenOpacityTo('bottomTxt12', 0, 0).start().onComplete(function(){steps[10].anim3 = null});

                        if (steps[10].anim4) steps[10].anim4.stop();                                           
                        steps[10].anim4 = tweenOpacityTo('watchVideoBtn2', 0, 0).start().onComplete(function(){steps[10].anim4 = null});
                        
                        if (steps[11].anim1) steps[11].anim1.stop();
                        steps[11].anim1 = tweenOpacityTo('txtTitl13', 1, 0).start().onComplete(function(){steps[11].anim1 = null});
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToNewGeometry(rloop.geometriesArray[13],0, 3); 
                        //return;
                    }
                }

                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<13.1 && direction=='down')
                    {          
                        rloop.animationStep = 13.1;        
                        neededActive = ['txtTitl13', 'mainTxt13' , 'bottomTxt13', 'txtTitl12' ];     
                        if (steps[10].anim1) steps[10].anim1.stop();
                        steps[10].anim1 = tweenOpacityTo('txtTitl12', 0, 0).start().onComplete(function(){steps[10].anim1 = null});

                        if (steps[11].anim2) steps[11].anim2.stop();                                           
                        steps[11].anim2 = tweenOpacityTo('mainTxt13', 1, 0).start().onComplete(function(){steps[11].anim2 = null});

                        if (steps[11].anim3) steps[11].anim3.stop();                                           
                        steps[11].anim3 = tweenOpacityTo('bottomTxt13', 1, 0).start().onComplete(function(){steps[11].anim3 = null});
                        tweenLogosInStep1();
                        //var fPartPoz = new THREE.Vector3(31,0,-60);
                        //var fPartRot = new THREE.Vector3(-Math.PI/64,-Math.PI/6.3,0);
                        //tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, fPartPoz, fPartRot);
                        //tweenToGeometryFromRandom(rloop.geometriesArray[12],0, null, false, false);                      
                        //return;
                    }
                }
                break;

            case 12:

                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 13.1 && rloop.animationStep <= 14 && direction=='up')
                    {
                        rloop.animationStep = 13.1;
                        tweenLogosInStep1();
                        tweenLogosOutStep2();
                        neededActive = ['txtTitl13', 'mainTxt13' , 'bottomTxt13', 'txtTitl14' ];         
                        if (steps[11].anim3) steps[11].anim3.stop();                        
                        steps[11].anim3 = tweenOpacityTo('bottomTxt13', 1, 0).start().onComplete(function(){steps[11].anim3 = null});   

                        if (steps[11].anim2) steps[11].anim2.stop();                        
                        steps[11].anim2 = tweenOpacityTo('mainTxt13', 1, 0).start().onComplete(function(){steps[11].anim2 = null});                                          

                        if (steps[12].anim1) steps[12].anim1.stop();
                        steps[12].anim1 = tweenOpacityTo('txtTitl14', 0, 0).start().onComplete(function(){steps[12].anim1 = null});                        
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 14 && direction=='up')
                    {
                        rloop.animationStep = 14;
                        neededActive = ['txtTitl14', 'mainTxt14' , 'bottomTxt14', 'txtTitl13' ];     
                        tweenLogosOutStep2();
                        if (steps[11].anim1) steps[11].anim1.stop();
                        steps[11].anim1 = tweenOpacityTo('txtTitl13', 1, 0).start().onComplete(function(){steps[11].anim1 = null});                                           

                        if (steps[12].anim2) steps[12].anim2.stop();                        
                        steps[12].anim2 = tweenOpacityTo('mainTxt14', 0, 0).start().onComplete(function(){steps[12].anim2 = null});

                        if (steps[12].anim3) steps[12].anim3.stop();                        
                        steps[12].anim3 = tweenOpacityTo('bottomTxt14', 0, 0).start().onComplete(function(){steps[12].anim3 = null});                       
                    }
                }  

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 14 && direction=='down')
                    {
                        rloop.animationStep = 14;
                        tweenLogosOutStep1();
                        neededActive = ['txtTitl14', 'mainTxt14' , 'bottomTxt14', '0' ];     
                        if (steps[11].anim2) steps[11].anim2.stop();                        
                        steps[11].anim2 = tweenOpacityTo('mainTxt13', 0, 0).start().onComplete(function(){steps[11].anim2 = null});

                        if (steps[11].anim3) steps[11].anim3.stop();                        
                        steps[11].anim3 = tweenOpacityTo('bottomTxt13', 0, 0).start().onComplete(function(){steps[11].anim3 = null});
                        
                        if (steps[12].anim1) steps[12].anim1.stop();
                        steps[12].anim1 = tweenOpacityTo('txtTitl14', 1, 0).start().onComplete(function(){steps[12].anim1 = null});
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        //tweenToNewGeometry(rloop.geometriesArray[13],0, 3); 
                        //return;
                    }
                }

                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<14.1 && direction=='down')
                    {          
                        rloop.animationStep = 14.1;        
                        neededActive = ['txtTitl14', 'mainTxt14' , 'bottomTxt14', 'txtTitl13' ];     
                        if (steps[11].anim1) steps[11].anim1.stop();
                        tweenLogosOutStep1();
                        steps[11].anim1 = tweenOpacityTo('txtTitl13', 0, 0).start().onComplete(function(){steps[11].anim1 = null});

                        if (steps[12].anim2) steps[12].anim2.stop();                                           
                        steps[12].anim2 = tweenOpacityTo('mainTxt14', 1, 0).start().onComplete(function(){steps[12].anim2 = null});

                        if (steps[12].anim3) steps[12].anim3.stop();                                           
                        steps[12].anim3 = tweenOpacityTo('bottomTxt14', 1, 0).start().onComplete(function(){steps[12].anim3 = null});
                        tweenLogosInStep2();                        
                    }
                }
                break;

            case 13:

                if (scrollPercentInStage<0.3)
                {
                    if (rloop.animationStep > 14.1 && rloop.animationStep <= 15 && direction=='up')
                    {
                        rloop.animationStep = 14.1;
                        tweenLogosInStep2();
                        neededActive = ['txtTitl14', 'mainTxt14' , 'bottomTxt14', 'txtTitl15' ];   
                        if (steps[12].anim3) steps[12].anim3.stop();                        
                        steps[12].anim3 = tweenOpacityTo('bottomTxt14', 1, 0).start().onComplete(function(){steps[12].anim3 = null});   

                        if (steps[12].anim2) steps[11].anim2.stop();                        
                        steps[12].anim2 = tweenOpacityTo('mainTxt14', 1, 0).start().onComplete(function(){steps[12].anim2 = null});                                          

                        if (steps[13].anim1) steps[13].anim1.stop();
                        steps[13].anim1 = tweenOpacityTo('txtTitl15', 0, 0).start().onComplete(function(){steps[13].anim1 = null});                        
                    }
                }

                if (scrollPercentInStage<0.7)
                {
                    if (rloop.animationStep > 15 && direction=='up')
                    {
                        rloop.animationStep = 15;
                        tweenToNewGeometry(rloop.geometriesArray[12],0, 3); 
                        neededActive = ['txtTitl15', 'mainTxt15' , 'bottomTxt15', 'txtTitl14' ];     
                        if (steps[12].anim1) steps[12].anim1.stop();
                        steps[12].anim1 = tweenOpacityTo('txtTitl14', 1, 0).start().onComplete(function(){steps[12].anim1 = null});                                           

                        if (steps[13].anim2) steps[13].anim2.stop();                        
                        steps[13].anim2 = tweenOpacityTo('mainTxt15', 0, 0).start().onComplete(function(){steps[13].anim2 = null});

                        if (steps[13].anim3) steps[13].anim3.stop();                        
                        steps[13].anim3 = tweenOpacityTo('bottomTxt15', 0, 0).start().onComplete(function(){steps[13].anim3 = null});                       
                    }
                }  

                if (scrollPercentInStage>0.4 && scrollPercentInStage<0.6) 
                {
                    if (rloop.animationStep < 15 && direction=='down')
                    {
                        //console.log('getting here:')
                        rloop.animationStep = 15;
                        tweenLogosOutStep2();
                        neededActive = ['txtTitl14', 'mainTxt14' , 'bottomTxt14', 'txtTitl15' ];     
                        if (steps[12].anim2) steps[12].anim2.stop();                        
                        steps[12].anim2 = tweenOpacityTo('mainTxt14', 0, 0).start().onComplete(function(){steps[12].anim2 = null});

                        if (steps[12].anim3) steps[12].anim3.stop();                        
                        steps[12].anim3 = tweenOpacityTo('bottomTxt14', 0, 0).start().onComplete(function(){steps[12].anim3 = null});
                        
                        if (steps[13].anim1) steps[13].anim1.stop();
                        steps[13].anim1 = tweenOpacityTo('txtTitl15', 1, 0).start().onComplete(function(){steps[13].anim1 = null});
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        //tweenToNewGeometry(rloop.geometriesArray[13],0, 3); 
                        //return;
                    }
                }

                if (scrollPercentInStage>0.6)
                {
                    if (rloop.animationStep<15.1 && direction=='down')
                    {          
                        rloop.animationStep = 15.1;        
                        neededActive = ['txtTitl14', 'mainTxt15' , 'bottomTxt15', 'txtTitl15' ];     
                        if (steps[12].anim1) steps[12].anim1.stop();
                        steps[12].anim1 = tweenOpacityTo('txtTitl14', 0, 0).start().onComplete(function(){steps[12].anim1 = null});

                        if (steps[13].anim2) steps[13].anim2.stop();                                           
                        steps[13].anim2 = tweenOpacityTo('mainTxt15', 1, 0).start().onComplete(function(){steps[13].anim2 = null});

                        if (steps[13].anim3) steps[13].anim3.stop();                                           
                        steps[13].anim3 = tweenOpacityTo('bottomTxt15', 1, 0).start().onComplete(function(){steps[13].anim3 = null});
                        console.log('camini', cameraInitialPosition, ' camlook: ', cameraLookAtNeutral, 'buffini:', bufferInitialPosition, 'buffrot: ', bufferInitialRotation)
                        tweenCameraAndGeometryToPositions(cameraInitialPosition, cameraLookAtNeutral, bufferInitialPosition, bufferInitialRotation);
                        tweenToGeometryFromRandom(rloop.geometriesArray[13],0, null, false, false);                          
                    }
                }
                break;

        }
        //TWEEN.update();
        // verifica daca sunt cele corecte:
        //console.log('needed active: ', neededActive)
        $('.section-tranz').each(function(){
            if (neededActive.indexOf(this.id)>=0)
            {
                //console.log('acum active: ', this.id)
            } else {
                this.style.opacity = 0;
            }
            // if (this.style.opacity>0 && this.style.opacity<1)
            // {
            //     //this.style.opacity = 0;
            //     // console.log('this: ', this);
            //     // if (idArray.indexOf(this.id)>=0) {
            //     //     //exclude this one
            //     // } else {
            //     //     this.style.opacity = 0;
            //     // }
            // }
        });
    }

    function getMiddlePointGeom4( fromThisGeom , newPosition )
    {
        
        var maxX = getMaxX(fromThisGeom.vertices) +1;
        //console.log('maxx: ', maxX);
        var arrayY = [];

        for (var j = 0;j<fromThisGeom.vertices.length; j++)
        {
            // fromThisGeom.vertices[j].destTemp = {
            //     x: fromThisGeom.vertices[j].destination.x,
            //     y: fromThisGeom.vertices[j].destination.y,
            //     z: fromThisGeom.vertices[j].destination.z,
            // }

            //fromThisGeom.vertices[j].destination.x = - maxX;
            //fromThisGeom.vertices[j].x = - maxX;

            // ACTIVEAZA INAPOI DACA REVENIM LA POZITIE INTERMEDIARA


            //console.log('this vert: ', fromThisGeom.vertices[j].destination);
            
            var exists = false;
            for (var q = 0;q<arrayY.length;q++)
            {
                if (fromThisGeom.vertices[j].destination.y == arrayY[q]) exists = true;
            }
            if (!exists) arrayY.push(fromThisGeom.vertices[j].destination.y);
        }

        //console.log('array y: ', arrayY);
        groupB.removeAll();
        for (j = 0; j<iconSprites.length;j++)
        {
            iconSprites[j].position.x = -0.2;
            iconSprites[j].position.y = arrayY[j]/2.255 ;
            iconSprites[j].scale.set(0,0,0)
            //iconSprites[j].position.z = -5;
            iconSprites[j].material.opacity = 0;
            iconSprites[j].visible = true;

            textGeomsArray[j].position.y = iconSprites[j].position.y - 0.45;
            if (j==0) textGeomsArray[j].position.x = 16.2;
            if (j==1) textGeomsArray[j].position.x = 8.2;
            if (j==2) textGeomsArray[j].position.x = 3.8;
            if (j==3) textGeomsArray[j].position.x = 2.5;


            new TWEEN.Tween(iconSprites[j].material, groupB)
                .to({opacity:1}, 300)
                .delay(j*100)
                .start();

            new TWEEN.Tween(iconSprites[j].scale, groupB)
                .to({x:1.3, y:1.3, z:1.3}, 400)
                .delay(j*100)
                .easing( TWEEN.Easing.Bounce.Out )
                .start();

            new TWEEN.Tween(textGeomsArray[j].t1.material, groupB)
                .to({opacity:1}, 400)
                .delay(j*100 + 500)
                .start();
        }
        //console.log('object sprites: ', iconObject);
        iconObject.position.x = 0;
        iconObject.position.y = newPosition.y + 0.67;
      
        return fromThisGeom;
    }

    function tweenLogosInStep1() {
        groupI.removeAll();
        for (var i=0;i<logo1Array.length;i++)
        {
            logo1Array[i].scale.set(0,0,0);
            logo1Array[i].material.opacity = 0;
            logo1Array[i].visible = true;

            new TWEEN.Tween(logo1Array[i].material, groupI)
                .to({opacity:1}, 300)
                .delay(i*50)
                .start();

            var scaleTo = logo1Array[i].scaleTo.x;
            new TWEEN.Tween(logo1Array[i].scale, groupI)
                .to({x:scaleTo, y:scaleTo, z:scaleTo}, 500)
                .delay(i*50)
                .easing( TWEEN.Easing.Elastic.Out )
                .start();
        }
    }

    function tweenLogosOutStep1() {
        groupI.removeAll();
        for (var i=0;i<logo1Array.length;i++)
        {
            new TWEEN.Tween(logo1Array[i].material, groupI)
                .to({opacity:0}, 200)
                .delay(i*20)
                .start();
            new TWEEN.Tween(logo1Array[i].scale, groupI)
                .to({x:0, y:0, z:0}, 200)
                .delay(i*20)
                .easing( TWEEN.Easing.Cubic.In )
                .start();
        }
    }

    function tweenLogosInStep2() {
        groupH.removeAll();
        for (var i=0;i<logo2Array.length;i++)
        {
            logo2Array[i].scale.set(0,0,0);
            logo2Array[i].material.opacity = 0;
            logo2Array[i].visible = true;

            new TWEEN.Tween(logo2Array[i].material, groupH)
                .to({opacity:1}, 300)
                .delay(i*50)
                .start();

            var scaleTo = logo2Array[i].scaleTo.x;
            new TWEEN.Tween(logo2Array[i].scale, groupH)
                .to({x:scaleTo, y:scaleTo, z:scaleTo}, 500)
                .delay(i*50)
                .easing( TWEEN.Easing.Elastic.Out )
                .start();
        }
    }

    function tweenLogosOutStep2() {
        groupH.removeAll();
        for (var i=0;i<logo2Array.length;i++)
        {
            new TWEEN.Tween(logo2Array[i].material, groupH)
                .to({opacity:0}, 200)
                .delay(i*20)
                .start();
            new TWEEN.Tween(logo2Array[i].scale, groupH)
                .to({x:0, y:0, z:0}, 400)
                .delay(i*20)
                .easing( TWEEN.Easing.Cubic.In )
                .start();
        }
    }

    function tweenIconsInStep2_1() {
        groupC.removeAll();
        for (var i=0; i<3;i++)
        {            
            iconSprites2[i].scale.set(0,0,0);
            iconSprites2[i].material.opacity = 0;
            iconSprites2[i].visible = true;

            new TWEEN.Tween(iconSprites2[i].material, groupC)
                .to({opacity:1}, 300)
                .delay(i*300)
                .start();

            var scaleTo = iconSprites2[i].scaleTo.x;
            new TWEEN.Tween(iconSprites2[i].scale, groupC)
                .to({x:scaleTo, y:scaleTo, z:scaleTo}, 800)
                .delay(i*300)
                .easing( TWEEN.Easing.Elastic.Out )
                .start();
            
        }
    }

    function tweenIconsOutStep2_1() {
        groupC.removeAll();
        for (var i=2; i>=0;i--)
        {            
            var del = 2-i;
            //iconSprites2[i].visible = true;

            new TWEEN.Tween(iconSprites2[i].material, groupC)
                .to({opacity:0}, 200)
                .delay(del*200)
                .start();

            new TWEEN.Tween(iconSprites2[i].scale, groupC)
                .to({x:0, y:0, z:0}, 500)
                .delay(del*200)
                .easing( TWEEN.Easing.Elastic.Out )
                .start();
            
        }
    }

    function tweenIconsInStep2_2() {
        groupD.removeAll();
        for (var i=3; i<4;i++)
        {
            iconSprites2[i].scale.set(0,0,0);
            iconSprites2[i].material.opacity = 0;
            iconSprites2[i].visible = true;

            new TWEEN.Tween(iconSprites2[i].material, groupD)
                .to({opacity:1}, 300)
                .delay((i-3)*300)
                .start();
            var scaleTo = iconSprites2[i].scaleTo;
            new TWEEN.Tween(iconSprites2[i].scale, groupD)
                .to({x:scaleTo.x, y:scaleTo.y, z:scaleTo.z}, 800)
                .delay((i-3)*300)
                .easing( TWEEN.Easing.Elastic.Out )
                .start();
            
        }
    }

    function tweenIconsOutStep2_2() {
        groupD.removeAll();
        for (var i=3; i<4;i++)
        {            
            new TWEEN.Tween(iconSprites2[i].material, groupD)
                .to({opacity:0}, 500)
                .start();
            new TWEEN.Tween(iconSprites2[i].scale, groupD)
                .to({x:0, y:0, z:0}, 500)
                .start();
        }
    }

    function tweenIconsInStep2_3() {
        groupE.removeAll();
        for (var i=4; i<7;i++)
        {            

            iconSprites2[i].scale.set(0,0,0);
            iconSprites2[i].material.opacity = 0;
            iconSprites2[i].visible = true;

            new TWEEN.Tween(iconSprites2[i].material, groupE)
                .to({opacity:1}, 300)
                .delay((i-4)*500)
                .start();

            var scaleTo = iconSprites2[i].scaleTo;
            new TWEEN.Tween(iconSprites2[i].scale, groupE)
                .to({x:scaleTo.x, y:scaleTo.y, z:scaleTo.z}, 800)
                .delay((i-4)*500)
                .easing( TWEEN.Easing.Elastic.Out )
                .start();
            
        }
    }

    function tweenIconsOutStep2_3() {
        groupE.removeAll();
        for (var i=4; i<7;i++)
        {
            new TWEEN.Tween(iconSprites2[i].material, groupE)
                .to({opacity:0}, 500)
                .start();

            var scaleTo = iconSprites2[i].scaleTo;
            new TWEEN.Tween(iconSprites2[i].scale, groupE)
                .to({x:0, y:0, z:0}, 500)
                .start();
            
        }
    }

     function tweenIconsInStep2_4() {
        groupF.removeAll();
        for (var i=7; i<10;i++)
        {            

            iconSprites2[i].scale.set(0,0,0);
            iconSprites2[i].material.opacity = 0;
            iconSprites2[i].visible = true;

            new TWEEN.Tween(iconSprites2[i].material, groupF)
                .to({opacity:1}, 300)
                .delay((i-7)*500)
                .start();

            var scaleTo = iconSprites2[i].scaleTo;
            new TWEEN.Tween(iconSprites2[i].scale, groupF)
                .to({x:scaleTo.x, y:scaleTo.y, z:scaleTo.z}, 800)
                .delay((i-7)*500)
                .easing( TWEEN.Easing.Elastic.Out )
                .start();
            
        }
    }


    function tweenIconsOutStep2_4() {
        groupF.removeAll();
        for (var i=7; i<10;i++)
        {
            new TWEEN.Tween(iconSprites2[i].material, groupF)
                .to({opacity:0}, 500)
                .start();

            var scaleTo = iconSprites2[i].scaleTo;
            new TWEEN.Tween(iconSprites2[i].scale, groupF)
                .to({x:0, y:0, z:0}, 500)
                .start();
            
        }
    }

    function tweenIconsInAllStep2 () {
        groupC.removeAll();
        groupD.removeAll();
        groupE.removeAll();
        groupF.removeAll();
        for (var i=0; i<3;i++)
        {            
            new TWEEN.Tween(iconSprites2[i].material, groupC)
                .to({opacity:1}, 500)
                .delay(i*300)
                .start();

            var scaleTo = iconSprites2[i].scaleTo.x;
            new TWEEN.Tween(iconSprites2[i].scale, groupC)
                .to({x:scaleTo, y:scaleTo, z:scaleTo}, 500)
                .delay(i*300)
                .easing( TWEEN.Easing.Elastic.Out )
                .start();
            
        }
        for (var i=3; i<4;i++)
        {            
            new TWEEN.Tween(iconSprites2[i].material, groupD)
                .to({opacity:1}, 500)
                .delay((i)*300)
                .start();
            var scaleTo = iconSprites2[i].scaleTo;
            new TWEEN.Tween(iconSprites2[i].scale, groupD)
                .to({x:scaleTo.x, y:scaleTo.y, z:scaleTo.z}, 500)
                .delay((i)*300)
                .easing( TWEEN.Easing.Elastic.Out )
                .start();
            
        }
        for (var i=4; i<7;i++)
        {
            new TWEEN.Tween(iconSprites2[i].material, groupE)
                .to({opacity:1}, 500)
                .delay((i)*300)
                .start();

            var scaleTo = iconSprites2[i].scaleTo;
            new TWEEN.Tween(iconSprites2[i].scale, groupE)
                .to({x:scaleTo.x, y:scaleTo.y, z:scaleTo.z}, 500)
                .delay((i)*300)
                .easing( TWEEN.Easing.Elastic.Out )
                .start();
            
        }
        for (var i=7; i<10;i++)
        {
            new TWEEN.Tween(iconSprites2[i].material, groupF)
                .to({opacity:1}, 500)
                .delay((i)*300)
                .start();

            var scaleTo = iconSprites2[i].scaleTo;
            new TWEEN.Tween(iconSprites2[i].scale, groupF)
                .to({x:scaleTo.x, y:scaleTo.y, z:scaleTo.z}, 500)
                .easing( TWEEN.Easing.Elastic.Out )
                .delay((i)*300)
                .start();            
        }
    }

    function tweenIconsOutAllStep2() {
        groupC.removeAll();
        groupD.removeAll();
        groupE.removeAll();
        groupF.removeAll();
        for (var i=0; i<3;i++)
        {            
            new TWEEN.Tween(iconSprites2[i].material, groupC)
                .to({opacity:0}, 500)
                .delay(i*50)
                .start();
            new TWEEN.Tween(iconSprites2[i].scale, groupC)
                .to({x:0, y:0, z:0}, 300)
                .delay(i*50)
                .start();
            
        }
        for (var i=3; i<4;i++)
        {            
            new TWEEN.Tween(iconSprites2[i].material, groupD)
                .to({opacity:0}, 500)
                .delay((i)*50)
                .start();
            new TWEEN.Tween(iconSprites2[i].scale, groupD)
                .to({x:0, y:0, z:0}, 300)
                .delay((i)*50)
                .start();            
        }
        for (var i=4; i<7;i++)
        {
            new TWEEN.Tween(iconSprites2[i].material, groupE)
                .to({opacity:0}, 300)
                .delay((i)*50)
                .start();
            new TWEEN.Tween(iconSprites2[i].scale, groupE)
                .to({x:0, y:0, z:0}, 300)
                .delay((i)*50)
                .start();            
        }
        for (var i=7; i<10;i++)
        {
            new TWEEN.Tween(iconSprites2[i].material, groupF)
                .to({opacity:0}, 300)
                .delay((i)*50)
                .start();
            new TWEEN.Tween(iconSprites2[i].scale, groupF)
                .to({x:0, y:0, z:0}, 300)
                .delay((i)*50)
                .start();
            
        }
    }    

    function tweenIconsOut() {
        //console.log('all out!');
        groupB.removeAll();
        for (var j = 0; j<iconSprites.length;j++)
        {            
            new TWEEN.Tween(iconSprites[j].material, groupB)
                .to({opacity:0}, 800)
                .delay(j*100)
                .start();

            new TWEEN.Tween(iconSprites[j].scale, groupB)
                .to({x:0, y:0, z:0}, 500)
                .delay(j*100)
                .easing( TWEEN.Easing.Bounce.Out )
                .start();

            new TWEEN.Tween(textGeomsArray[j].t1.material, groupB)
                .to({opacity:0}, 500)
                .delay(j*100 + 200)
                .start();
        }
    }

    function getMaxX ( vertici )
    {
        var max = 0;
        for (var j = 0;j<vertici.length; j++)
        {
            
            if (vertici[j].x > max) max = vertici[j].x;
        }
        return max;
    }

    function tweenCameraAndGeometryToPositions( camPosition, camLookAt, bufferGeometryPosition, bufferGeometryRoration )
    {
        //console.log('starting tweens with params: ', camPosition, camLookAt, bufferGeometryPosition, bufferGeometryRoration)
        var camPozTween = new TWEEN.Tween(rloop.camera.position, groupA)
            .to({x:camPosition.x, y:camPosition.y, z:camPosition.z}, 500)
            .easing( TWEEN.Easing.Cubic.InOut )
            //.interpolation( TWEEN.Interpolation.Bezier )
            .onUpdate( function() {
                rloop.camera.lookAt(new THREE.Vector3(0,0,0));

            })
            .start();

        var buffGeomPositionTween = new TWEEN.Tween(rloop.bufferParticles.position, groupA)
            .to({x:bufferGeometryPosition.x, y:bufferGeometryPosition.y, z:bufferGeometryPosition.z}, 1000)
            .easing( TWEEN.Easing.Cubic.InOut )
            .onUpdate( function() {
                //console.log('updating buffer position: ', rloop.bufferParticles.position);
            })
            .start();

        var buffGeomRotationTween = new TWEEN.Tween(rloop.bufferParticles.rotation, groupA)
            .to({x:bufferGeometryRoration.x, y:bufferGeometryRoration.y, z:bufferGeometryRoration.z}, 500)
            .easing( TWEEN.Easing.Cubic.InOut )
            .onUpdate( function() {
                
            })
            .start();
    }

    function executeAfterMiddlePoint()
    {
        //console.log('now going to 4')
        tweenToGeometryFromGeometry(rloop.geometriesArray[4], 0, null, true)
    }

    var coinTween;
    var coinIsIn = false;
    function executeAfterLoadingCircle() {
        // coinObject.visible = true;
        // coinObject.rotation.y = -Math.PI/14;

        
        if (coinTween) coinTween.stop();
        coinTween = null; 
        coinIsIn = true;  
        //coinObject.visible = true;
        //console.log('coin tween: ', coinObject.rotation);
        coinTween = new TWEEN.Tween(coinObject.rotation )
            .to({y: -Math.PI/14}, 900)
            .easing( TWEEN.Easing.Elastic.Out )
            .delay(1000)
            .onStart(function(){
                coinObject.visible = true;
            })
            .onComplete(function(){
                coinTween = null;
            })
            .start();

        
    }

    function executeAfterExitCircle() {
        //coinObject.visible = false;
        //coinObject.rotation.y = Math.PI/2 - Math.PI/11.25 + Math.PI;

        if (coinTween) coinTween.stop();
        coinIsIn = false;
        coinTween = null;   
        //console.log('coin tween out: ', coinObject.rotation);

        coinTween = new TWEEN.Tween(coinObject.rotation)
            .to({y: Math.PI/2 - Math.PI/11.25 + Math.PI}, 600)           
            .onComplete(function(){
                //console.log('ready out!')
                coinObject.visible = false;
                coinTween = null;                
            })            
            .start();      
    }

    function addWheelEventsAfterStep1() {
        //return;
        document.addEventListener('wheel', function(event){


            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            //incepem animatia a doua
            if (scrollTop == 0 && event.deltaY>0)
            {

            }

            // var ftomTop = document.getElementById('main').scrollTop;
            // console.log('from Top: ', ftomTop,', deltay: ',event.deltaY, ' scrolltop: ', scrollTop);
            // rloop.bufferParticles.initialPos = rloop.bufferParticles.position.clone();
            // new TWEEN.Tween(rloop.bufferParticles.position)
            //     .to({y: rloop.bufferParticles.position.y + event.deltaY/33}, 500)
            //     //.easing( TWEEN.Easing.Cubic.InOut )
            //     .start();
        }, false);
    }



    function startAnimationStep () {
        rloop.animatingTween = true;
        var allparticles = rloop.particles;
        var countAnimations = 0;
        for (var i=0;i<allparticles.geometry.vertices.length;i++)
        {
            var part = allparticles.geometry.vertices[i];
            part.i = i;
            var raza = [180, 10, 5];
            var destOnCircle1 = {
                x: part.destination.x + raza[0] * Math.sin(Math.PI/2),
                y: part.destination.y + raza[0] * Math.cos(Math.PI/2),
                z: part.destination.z
            }

            var destOnCircle2 = {
                x: part.destination.x + raza[1] * Math.sin(-Math.PI/4),
                y: part.destination.y + raza[1] * Math.cos(-Math.PI/4),
                z: part.destination.z
            }

            var destOnCircle3 = {
                x: part.destination.x + raza[2] * Math.sin(-Math.PI/2+Math.PI/4),
                y: part.destination.y + raza[2] * Math.cos(-Math.PI/2+Math.PI/4),
                z: part.destination.z
            }

            var t = new TWEEN.Tween(part , groupPoints)
                //.to({x:})
                //.to({x:[ Math.random()*part.destination.x*8-part.destination.x*2, Math.random()*part.destination.x*6-part.destination.x*4, part.destination.x], y:[Math.random()*part.destination.y*8 - part.destination.y*16, Math.random()*part.destination.y*6 - part.destination.y*12,part.destination.y], z:[Math.random()*part.destination.z*15 - part.destination.z*5, Math.random()*part.destination.z*6 - part.destination.z*4,part.destination.z]}, part.speed * rloop.speedFactor * 3000000)
                .to({x: [destOnCircle1.x, destOnCircle2.x, destOnCircle3.x, part.destination.x], y: [destOnCircle1.y, destOnCircle2.y, destOnCircle3.y, part.destination.y], z: [destOnCircle1.z, destOnCircle2.z, destOnCircle3.z, part.destination.z]}, part.speed * 100000)
                .easing( TWEEN.Easing.Sinusoidal.InOut )
                .interpolation( TWEEN.Interpolation.Bezier )
                .onUpdate( function() {
                    var positions = rloop.bufferParticles.geometry.attributes.position.array;
                    //console.log('this: ', this._object)
                    positions[this._object.i*3 + 0] = rloop.particles.geometry.vertices[this._object.i].x;
                    positions[this._object.i*3 + 1] = rloop.particles.geometry.vertices[this._object.i].y;
                    positions[this._object.i*3 + 2] = rloop.particles.geometry.vertices[this._object.i].z;
                })
                .onComplete(function(){
                    countAnimations++;
                    if (countAnimations==allparticles.geometry.vertices.length)
                    {
                        //console.log('aniation complete 1 ')
                        rloop.animatingTween = false;
                        startAnimationStepOut(2000);
                    }
                    //rloop.particles.geometry.verticesNeedUpdate = true;
                })
                .start();
        }
    }

    function tweenToGeometryFromGeometry(newGeometry, wait, runAfterFinish, ordered)
    {
        //return;
        //console.log('running this')
        groupPoints.removeAll();
        TWEEN.removeAll();
        rloop.idleWithParticles = false;
        time = 0;
        //WE ALREADY HAVE THE BUFFER GEOMETRY IF WE STOPPED THE ANIMATION EARLIER
        if (wait == undefined || wait == null) wait = 0;

        rloop.animatingTween = true;
        //rloop.particles.geometry = newGeometry;
        var allparticles = rloop.particles;
        var newParticles = newGeometry;

        var countUnmarkedForDelete = 0;        

        var countAnimationsStarted2 = 0;
        var countAnimationsEnded2 = 0;

        var countOnlyAnimated = 0;
        for ( var par = 0; par < allparticles.geometry.vertices.length; par++ )
        {
            var part = allparticles.geometry.vertices[par];
            var dest = {
                x: part.x,
                y: part.y,
                z: part.z,
                
                alpha: part.alpha,
                //alpha: ( part.markedDelete) ? 0 : 0.2,
                size: part.size
            }

            var dest2 = {
                x:dest.x,
                y:dest.y,
                z:dest.z,
                alpha: dest.alpha,
                size: dest.size
            }
            //part.i = par;
            part.dest2 = dest2;
            // if (part.markedDelete)
            // {
            //     part.dest2 = {
            //         x: - Math.random() * 100 + 50,
            //         y: Math.random() * 50 - 25,
            //         z: Math.random() * 30, //+  //- 500;
            //         alpha: 0 ,//( part.markedDelete) ? 0 : 0.2,
            //         size: Math.random()
            //     }
            // }
            if (part.destTemp) {
                countOnlyAnimated++;
                part.dest2.x = part.destTemp.x;
                var duration = ordered ? (countOnlyAnimated * 50 + 400) : part.speed * 50000;
                //console.log('going to destination: ', part.dest2.x);
                var t = new TWEEN.Tween(part, groupPoints)
                    .to({x:part.dest2.x+2.5}, duration)
                    .delay(wait)
                    .easing( TWEEN.Easing.Cubic.InOut )
                    //.interpolation( TWEEN.Interpolation.Bezier )
                    .onUpdate(function()
                    {   
                        var positions = rloop.bufferParticles.geometry.attributes.position.array;
                        positions[this._object.i*3 + 0] = rloop.particles.geometry.vertices[this._object.i].x;                        

                    })
                    .onComplete(function(){
                        countAnimationsEnded2++;
                        if (countAnimationsStarted2 == countAnimationsEnded2)
                        {   
                            rloop.geometriesArray[4] = createGeomFromImageData(loadedSteps[imageSteps[3]].imgData);
                            //rloop.particles = new THREE.Points(newParticles, material);
                            //rloop.particles.geometry = newGeometry;
                            //if (runAfterFinish) runAfterFinish();
                        }
                    })
                    .onStart(function(){
                        countAnimationsStarted2++;
                    })
                    .start();
            }    
        }

    }

    function tweenToGeometryFromRandom(newGeometry, wait, runAfterFinish, ordered, iterate)
    {   
        //TWEEN.removeAll();
        groupPoints.removeAll();
        rloop.idleWithParticles = false;
        time = 0;
        //WE ALREADY HAVE THE BUFFER GEOMETRY IF WE STOPPED THE ANIMATION EARLIER
        if (wait == undefined || wait == null) wait = 0;

        
        //rloop.particles.geometry = newGeometry;
        var allparticles = rloop.particles;
        var newParticles = newGeometry;

        var vertDifference = newParticles.vertices.length - allparticles.geometry.vertices.length;
        vertDifference = newParticles.vertices.length - rloop.bufferParticles.geometry.attributes.position.length/3
        //console.log('buffer poz: ',rloop.bufferParticles.geometry.attributes.position.length/3, ', vert dif: ', vertDifference)
        for (var q = 0; q< allparticles.geometry.vertices.length;q++)
        {
            allparticles.geometry.vertices[q].markedDelete = false;
            //allparticles.geometry.vertices[q].alpha = 0;
        }
        if (vertDifference<0)                                       // we need less particles, mark them for deletion
        {
            //console.log('taking from array: ', rloop.particles.geometry.vertices, ' a total of: ', Math.abs(vertDifference))
            var tempArr = [];
            if (iterate) {
                //console.log('iterating...');
                tempArr = rloop.particles.geometry.vertices.slice(0, vertDifference)
            } else tempArr = getRandom(rloop.particles.geometry.vertices, Math.abs(vertDifference));
            //console.log('temp array length: ', tempArr.length)
            for (var j=0;j<tempArr.length;j++)
            {
                var deleteThisParticle = tempArr[j];
                allparticles.geometry.vertices[tempArr[j].i].markedDelete = true;
                allparticles.geometry.vertices[tempArr[j].i].alpha = 0;
               // deleteThisParticle.markedDelete = true;
            }
        } else {
            
            if (vertDifference>0){                               //we need more particles, mark for adding (add some neutral ones)
                addMoreParticles( vertDifference );
                //console.log('adding particles: ', vertDifference, rloop.geometriesArray[7]);
                updateTheBufferGeometryToMoreParticles( vertDifference );
            }
        }
        rloop.animatingTween = true;
        var countNewAnimations = 0;
        var countUnmarkedForDelete = 0;        

        var countAnimationsStarted = 0;
        var countAnimationsEnded = 0;
        for ( var par = 0; par < allparticles.geometry.vertices.length; par++ )
        {
            var part = allparticles.geometry.vertices[par];
            var dest = {
                x: - Math.random() * 100 + 50,
                y: Math.random() * 50 - 25,
                z: Math.random() * 30, //+  //- 500;
                alpha: Math.random() * 0.5,
                alpha: 0,
                //alpha: ( part.markedDelete) ? 0 : 0.2,
                size: Math.random() * defaultPixedSize
            }

            var dest2 = {
                x:dest.x,
                y:dest.y,
                z:dest.z,
                alpha: 0,
                size: Math.random() * defaultPixedSize
            }
            part.i = par;
            part.dest2 = dest2;
            if (part.markedDelete)
            {
                part.dest2 = {
                    x: - Math.random() * 100 + 50,
                    y: Math.random() * 50 - 25,
                    z: Math.random() * 30, //+  //- 500;
                    alpha: 0 ,//( part.markedDelete) ? 0 : 0.2,
                    size: Math.random() * defaultPixedSize
                }
            }



            if (!part.markedDelete && newParticles.vertices[countUnmarkedForDelete]) {

                dest2.x = newParticles.vertices[countUnmarkedForDelete].x;
                dest2.y = newParticles.vertices[countUnmarkedForDelete].y;
                dest2.z = newParticles.vertices[countUnmarkedForDelete].z;

                dest2.r = newParticles.vertices[countUnmarkedForDelete].color.r;
                dest2.g = newParticles.vertices[countUnmarkedForDelete].color.g;
                dest2.b = newParticles.vertices[countUnmarkedForDelete].color.b;
                dest2.size = newParticles.vertices[countUnmarkedForDelete].size;
                dest2.alpha = newParticles.vertices[countUnmarkedForDelete].alpha;
                part.dest2 = dest2;
                if (newParticles.vertices[countUnmarkedForDelete].destTemp) part.destTemp = newParticles.vertices[countUnmarkedForDelete].destTemp;
                countUnmarkedForDelete++;
            }

            part.r = part.color.r;
            part.g = part.color.g;
            part.b = part.color.b;

            var duration = ordered ? part.dest2.x * 100 : part.speed * 50000;

            var t = new TWEEN.Tween(part, groupPoints)
                .to({x:part.dest2.x, y:part.dest2.y, z:part.dest2.z, alpha:part.dest2.alpha, size: part.dest2.size, r: part.dest2.r, g: part.dest2.g, b: part.dest2.b}, duration)
                .delay(wait)
                .easing( TWEEN.Easing.Cubic.InOut )
                .interpolation( TWEEN.Interpolation.Bezier )
                .onUpdate(function()
                {   
                    var positions = rloop.bufferParticles.geometry.attributes.position.array;
                    positions[this._object.i*3 + 0] = rloop.particles.geometry.vertices[this._object.i].x;
                    positions[this._object.i*3 + 1] = rloop.particles.geometry.vertices[this._object.i].y;
                    positions[this._object.i*3 + 2] = rloop.particles.geometry.vertices[this._object.i].z;

                    var colors = rloop.bufferParticles.geometry.attributes.customColor.array;
                    colors[this._object.i*3 + 0] = this._object.r;
                    colors[this._object.i*3 + 1] = this._object.g;
                    colors[this._object.i*3 + 2] = this._object.b;

                    this._object.color.r = this._object.r;
                    this._object.color.g = this._object.g;
                    this._object.color.b = this._object.b;

                    rloop.bufferParticles.geometry.attributes.alpha.array[this._object.i] = this._object.alpha;
                    rloop.bufferParticles.geometry.attributes.size.array[this._object.i] = this._object.size;

                    rloop.bufferParticles.geometry.attributes.alpha.needsUpdate = true;
                    rloop.bufferParticles.geometry.attributes.size.needsUpdate = true;
                    rloop.bufferParticles.geometry.attributes.customColor.needsUpdate = true;

                    if (this._object.markedDelete) {
                        rloop.bufferParticles.geometry.attributes.alpha.array[this._object.i] = this._object.alpha;
                    }
                })
                .onComplete(function(){
                    countAnimationsEnded++;
                    //console.log('animations ended: ', countAnimationsEnded)
                    if (countAnimationsStarted == countAnimationsEnded)
                    {   
                        //rloop.particles = new THREE.Points(newParticles, material);
                        //rloop.particles.geometry = newGeometry;
                        //console.log('running after finish')
                        if (runAfterFinish) runAfterFinish();
                    }
                })
                .onStart(function(){
                    countAnimationsStarted++;
                })
                .start();
        }
    }

    function tweenToNewGeometry( newGeometry, wait, randomFactor )
    {
        //console.log('starting new animation:')
        //TWEEN.removeAll();
        groupPoints.removeAll();
        if (wait == undefined || wait == null) wait = 0;
        if (randomFactor == undefined || randomFactor == null) randomFactor = 1;

        rloop.animatingTween = true;
        var allparticles = rloop.particles;
        var newParticles = newGeometry;

        var vertDifference = newParticles.vertices.length - allparticles.geometry.vertices.length;

        vertDifference = newParticles.vertices.length - rloop.bufferParticles.geometry.attributes.position.length/3;
        //console.log('vert difference: ', vertDifference);
        //console.log('buffer poz: ',rloop.bufferParticles.geometry.attributes.position.length/3, ', vert dif: ', vertDifference)
        if (vertDifference<0)                                       // we need less particles, mark them for deletion
        {
            //console.log('buffer geometry length: ', rloop.bufferParticles.geometry.attributes.position.length/3);
            //console.log('rloop.particles.geometry: ', rloop.particles.geometry.vertices.length, ' difference: ', Math.abs(vertDifference));
            var tempArr = getRandom(rloop.particles.geometry.vertices, Math.abs(vertDifference));
            for (var j=0;j<tempArr.length;j++)
            {
                var deleteThisParticle = tempArr[j];
                allparticles.geometry.vertices[tempArr[j].i].markedDelete = true;
               // deleteThisParticle.markedDelete = true;
            }
            //console.log('marked again to delete: ', tempArr)
        } else {
            for (var q = 0; q< allparticles.geometry.vertices.length;q++)
            {
                allparticles.geometry.vertices[q].markedDelete = false;
            }
            if (vertDifference>0){                               //we need more particles, mark for adding (add some neutral ones)
                addMoreParticles( vertDifference );
                updateTheBufferGeometryToMoreParticles( vertDifference );
            }
        }

        var cc = 0;
        for ( var q=0;q< allparticles.geometry.vertices.length;q++ )
        {
            if (allparticles.geometry.vertices[q].markedDelete) cc++
        }
        //console.log('total logged for deletion in new geom: ', cc);

        //rloop.bufferParticles = updateNewBufferGeometryFromGeometry( newParticles )// new THREE.Points(updateNewBufferGeometryFromGeometry( rloop.particles ), shaderMaterial); 
        //rloop.bufferParticles = updateNewBufferGeometryFromGeometry ( newParticles )

        //ANIMATE ALL TO RANDOM
        var countNewAnimations = 0;
        var countUnmarkedForDelete = 0;
        for ( var par = 0; par < allparticles.geometry.vertices.length; par++ )
        {
            var part = allparticles.geometry.vertices[par];
            var dest = {
                x: - Math.random() * 100 + 50,
                y: Math.random() * 50  - 25,
                z: Math.random() * 30 , //+  //- 500;
                alpha: Math.random() * 0.5,
                //alpha: ( part.markedDelete) ? 0 : 0.2,
                size: Math.random() * defaultPixedSize
            }

            if (randomFactor>1)
            {
                dest.x = Math.random() * 100 * (randomFactor) - 50 * randomFactor;
                dest.y = Math.random() * 50 * randomFactor - 25*randomFactor;
                dest.z = Math.random() * 30 * randomFactor ;
                dest.alpha = Math.random() * 1/randomFactor;
                dest.size = Math.random() * defaultPixedSize * randomFactor/2
            }

            var dest2 = {
                x:dest.x,
                y:dest.y,
                z:dest.z,

                r : part.color.r,
                g : part.color.g,
                b : part.color.b,
            }
            part.i = par;

            part.r = part.color.r;
            part.g = part.color.g;
            part.b = part.color.b;
            
            //console.log('part color: ', part);
            //console.log('eroare dupa: ', countUnmarkedForDelete);
            

            //console.log('going to x: ', dest);
            var t = new TWEEN.Tween(part , groupPoints)
                .to({x:dest.x, y:dest.y, z:dest.z, alpha:dest.alpha, size: dest.size, r: dest2.r, g: dest2.g, b: dest2.b}, part.speed * 60000)
                .delay(wait)
                .easing( TWEEN.Easing.Cubic.InOut )
                .interpolation( TWEEN.Interpolation.Bezier )
                .onUpdate(function()
                {   
                    //console.log('updating: ')
                    var positions = rloop.bufferParticles.geometry.attributes.position.array;
                    positions[this._object.i*3 + 0] = rloop.particles.geometry.vertices[this._object.i].x;
                    positions[this._object.i*3 + 1] = rloop.particles.geometry.vertices[this._object.i].y;
                    positions[this._object.i*3 + 2] = rloop.particles.geometry.vertices[this._object.i].z;
                    this._object.color.r = this._object.r;
                    this._object.color.g = this._object.g;
                    this._object.color.b = this._object.b;

                    var colors = rloop.bufferParticles.geometry.attributes.customColor.array;
                    colors[this._object.i*3 + 0] = this._object.r;
                    colors[this._object.i*3 + 1] = this._object.g;
                    colors[this._object.i*3 + 2] = this._object.b;

                    rloop.bufferParticles.geometry.attributes.alpha.array[this._object.i] = this._object.alpha;
                    rloop.bufferParticles.geometry.attributes.size.array[this._object.i] = this._object.size;

                    rloop.bufferParticles.geometry.attributes.alpha.needsUpdate = true;
                    rloop.bufferParticles.geometry.attributes.size.needsUpdate = true;
                    rloop.bufferParticles.geometry.attributes.customColor.needsUpdate = true;

                    
                })
                .onComplete(function(){
                    rloop.idleWithParticles = true;
                    if (this.markedDelete) {
                        //console.log('marked with delete!');
                        //rloop.bufferParticles.geometry.attributes.alpha.array[this.i] = this.alpha;
                    }
                })
                .onStart(function(){
                    if (this.markedDelete) {
                       // console.log('marked with delete! at begining');
                        //rloop.bufferParticles.geometry.attributes.alpha.array[this.i] = this.alpha;
                    }
                })
                .start();
        }        
    }

    function addMoreParticles( howManyToAdd)
    {
        for (var i=0;i<howManyToAdd;i++)
        {
            var vert = new THREE.Vector3();
            vert.x = - Math.random() * 100 + 50;
            vert.y = Math.random() * 100 - 50;
            vert.z = Math.random() * 50 //- 500;
            vert.destination = {
                x: - Math.random() * 100 + 50,
                y: Math.random() * 30 - 15,
                z: Math.random() * 20 //+  //- 500;
            }
            vert.size = 1 * defaultPixedSize;
            vert.alpha = 0;
            //console.log('size:', vert.size)
            vert.color = new THREE.Color('rgb(255, 255, 255)');
            vert.speed = Math.random() / 200 + rloop.speedFactor;

            rloop.particles.geometry.vertices.push(vert);
        }
    }

    function startAnimationStepOut (wait) {
        if (wait == undefined || wait == null) wait = 1000;
        var countAnimations = 0;
        var countNewAnimations = 0;
        rloop.animatingTween = true;
        rloop.animationStep++;
        //rloop.particlesOld = rloop.particles;
        //rloop.particles = null;
        var newParticles = createGeomFromImageData(loadedSteps[imageSteps[rloop.animationStep]].imgData);//, loadedSteps[imageSteps[rloop.animationStep]].img);
        var allparticles = rloop.particles;
        var vertDifference = newParticles.vertices.length - rloop.particles.geometry.vertices.length;
        //vertDifference = newParticles.vertices.length - rloop.bufferParticles.geometry.attributes.position.length/4;
        //console.log('vertDifference: ',vertDifference);
        if (vertDifference<0)
        {
            var tempArr = getRandom(rloop.particles.geometry.vertices, Math.abs(vertDifference));
            for (var j=0;j<tempArr.length;j++)
            {
                var deleteThisParticle = tempArr[j];
                deleteThisParticle.markedDelete = true;
                //console.log('marked;');
            }
            
        }
        var cc = 0;
        for ( var q=0;q< allparticles.geometry.vertices.length;q++ )
        {
            if (allparticles.geometry.vertices[q].markedDelete) cc++;
            //allparticles.geometry.vertices[q].z = -5;
        }

        for (q=0;q<newParticles.vertices.length;q++)
        {
            newParticles.vertices[q].z = -10;
        }
        //console.log('total logged for deletion: ', cc);
        var countFinalAnimationsStart = 0;
        var countFinalAnimationsEnd = 0;

        var opacTween1 = tweenOpacityTo('pre-block', 1, 500);
        for ( var par = 0; par < allparticles.geometry.vertices.length; par++ )
        {
            var part = allparticles.geometry.vertices[par];
            var dest = {
                x: - Math.random() * 100 + 50,
                y: Math.random() * 30 - 15,
                z: Math.random() * 20 //+  //- 500;
            }
            //console.log('this par: ', par);
            part.i = par;
            part.opacity = 1;
            var alpha =( part.markedDelete) ? 0 : 1;
            var t = new TWEEN.Tween(part, groupPoints)
                .to({x:dest.x, y:dest.y, z:dest.z, alpha:alpha}, part.speed * 20000)
                .delay(wait)
                .easing( TWEEN.Easing.Cubic.InOut )
                .interpolation( TWEEN.Interpolation.Bezier )
                .onUpdate(function()
                {   
                    var positions = rloop.bufferParticles.geometry.attributes.position.array;
                    positions[this._object.i*3 + 0] = rloop.particles.geometry.vertices[this._object.i].x;
                    positions[this._object.i*3 + 1] = rloop.particles.geometry.vertices[this._object.i].y;
                    positions[this._object.i*3 + 2] = rloop.particles.geometry.vertices[this._object.i].z;
                    if (this._object.markedDelete) {
                        //console.log('this: ', allparticles.geometry);
                        rloop.bufferParticles.geometry.attributes.alpha.array[this._object.i] = this._object.alpha;
                        rloop.bufferParticles.geometry.attributes.alpha.needsUpdate = true;
                        //console.log('marked for deletion');
                        //allparticles.geometry.vertices.splice(allparticles.geometry.vertices.indexOf(this), 1)
                    }
                })
                .onComplete(function(){
                    countAnimations++;
                    if (this._object.markedDelete) {
                        //console.log('marked for deletion');
                        this._object.z = 500;
                        rloop.bufferParticles.geometry.attributes.position.array[this._object.i*3 + 2] = this._object.z;
                        //allparticles.geometry.vertices.splice(allparticles.geometry.vertices.indexOf(this), 1)
                    } else {
                        //console.log('countNewAnimations: ', countNewAnimations);
                        if (countNewAnimations<newParticles.vertices.length){
                            this._object.color = newParticles.vertices[countNewAnimations].color;

                            var t1 = new TWEEN.Tween(this._object , groupPoints)
                                .to({x:newParticles.vertices[countNewAnimations].x, y:newParticles.vertices[countNewAnimations].y, z:newParticles.vertices[countNewAnimations].z}, part.speed * 30000 )
                                .easing( TWEEN.Easing.Cubic.InOut )
                                .onUpdate(function() {
                                    var positions = rloop.bufferParticles.geometry.attributes.position.array;
                                    positions[this._object.i*3 + 0] = rloop.particles.geometry.vertices[this._object.i].x;
                                    positions[this._object.i*3 + 1] = rloop.particles.geometry.vertices[this._object.i].y;
                                    positions[this._object.i*3 + 2] = rloop.particles.geometry.vertices[this._object.i].z;
                                })
                                .onComplete(function() {
                                    countAnimations++;
                                    var compare8uint = new Uint8Array(3);
                                    compare8uint[0] = this._object.color.r;
                                    compare8uint[1] = this._object.color.g;
                                    compare8uint[2] = this._object.color.b;
                                    var currentVertexColor = [
                                        rloop.bufferParticles.geometry.attributes.customColor.array[this._object.i*3],
                                        rloop.bufferParticles.geometry.attributes.customColor.array[this._object.i*3 +1],
                                        rloop.bufferParticles.geometry.attributes.customColor.array[this._object.i*3 +2]
                                    ]
                                    //if ((this.color.r != rloop.whiteColor.r) || (this.color.g != rloop.whiteColor.g) || (this.color.b != rloop.whiteColor.b))
                                    if ((compare8uint[0] != currentVertexColor[0]) || (compare8uint[1] != currentVertexColor[1]) || (compare8uint[2] != currentVertexColor[2]))
                                    {
                                        //console.log('new  color: ',compare8uint[0], 'current : ',rloop.bufferParticles.geometry.attributes.customColor.array[this.i*3], compare8uint[0] == rloop.bufferParticles.geometry.attributes.customColor.array[this.i*3]);
                                        this._object.dummy = 1;
                                        var t2 = new TWEEN.Tween(this._object , groupPoints)
                                            .to({dummy:1}, Math.round(Math.random()*1000))
                                            .delay(Math.round(Math.random()*1000) + 1500)
                                            .onComplete(function()
                                            {
                                                var colors = rloop.bufferParticles.geometry.attributes.customColor.array;
                                                colors[this._object.i*3 + 0] = this._object.color.r;
                                                colors[this._object.i*3 + 1] = this._object.color.g;
                                                colors[this._object.i*3 + 2] = this._object.color.b;

                                                rloop.bufferParticles.geometry.attributes.customColor.needsUpdate = true;
                                                countFinalAnimationsEnd++;
                                                if (countFinalAnimationsStart == countFinalAnimationsEnd) {
                                                    //  CONTINUE TOWARDS SECOND ANIMATION ( COIN )
                                                    //console.log('whats going on?', countFinalAnimationsEnd)
                                                    //rloop.animatingTween = false;
                                                    //rloop.particles = new THREE.Points(newParticles, material);
                                                    //console.log('scene contains: ', rloop.scene);
                                                    //rloop.scene.remove(rloop.bufferParticles);

                                                    //rloop.bufferParticles.geometry.dispose();
                                                    //rloop.bufferParticles = null;
                                                    //rloop.bufferParticles = updateNewBufferGeometryFromGeometry( rloop.particles.geometry )// new THREE.Points(updateNewBufferGeometryFromGeometry( rloop.particles ), shaderMaterial); 
                                                    
                                                    //console.log('rloop buffer particles new: ', rloop.bufferParticles)
                                                    //rloop.scene.add(rloop.bufferParticles);
                                                    //console.log('scene contains 2: ', rloop.scene);

                                                    //rloop.bufferParticles.position.y = 0.3;
                                                    //rloop.bufferParticles.geometry.attributes.position.needsUpdate = true;
                                                    //rloop.bufferParticles.geometry.attributes.customColor.needsUpdate = true;
                                                    //rloop.bufferParticles.geometry.attributes.alpha.needsUpdate = true;
                                                    //rloop.bufferParticles.geometry.attributes.size.needsUpdate = true;
                                                    //rloop.animatingTween = false;
                                                    //rloop.animatingTween = false;
                                                }
                                            })
                                            .start();
                                        countFinalAnimationsStart++;
                                    }
                                    //console.log('anim started at: ',countAnimations);
                                    if (countAnimations==(allparticles.geometry.vertices.length + newParticles.vertices.length))
                                    {
                                        //console.log('anim started at: ',countAnimations);
                                        var opacTw2 = tweenOpacityTo('post-block1', 1, 900).start();
                                        tweenOpacityTo('post-block2', 1, 1200).start();
                                        tweenOpacityTo('post-block3', 1, 1400).start();
                                        tweenOpacityTo('post-block4', 1, 1500).start();

                                        document.getElementById('main').style.height = '100vh';
                                        document.getElementById('main').style.display = 'block';

                                        document.getElementById('btnDown').style.opacity = 0.65;
                                        document.getElementById('btnDown').style.pointerEvents = 'auto';
                                        scrollMagicController.enabled(true);




                                        
                                        setTimeout(function () { if (myScroll) myScroll.refresh(); }, 100);
                                        
                                        //console.log('magic scroller should be enabled now!')
                                        addWheelEventsAfterStep1();
                                        addEvents();

                                       
                                        //rloop.scene.add(rloop.bufferParticles);
                                        //console.log('after: ', rloop.bufferParticles.geometry.attributes.position.count);
                                        //document.getElementById('body').style.overflow = 'visible';
                                    }
                                    //console.log('count animations: ', countAnimations)
                                })
                                .interpolation( TWEEN.Interpolation.Bezier )
                                .start();    
                        }                        
                        countNewAnimations++;
                    }

                    if (countAnimations==allparticles.geometry.vertices.length)
                    {
                        opacTween1.start();
                        //rloop.animatingTween = false;
                        //startAnimationStepOut(allparticles, 1000);
                    }

                    
                    //rloop.particles.geometry.verticesNeedUpdate = true;
                })
                .start();
        }
    }

    // function tweenToNewGeometry( geometry )
    // {
    //     updateNewBufferGeometryFromGeometry(geometry)
    // }

    function tweenOpacityTo(divId, toOpacity, waitMili, speed)
    {   
        if (waitMili==null || waitMili == undefined) waitMili = 0;
        if (speed == null || speed == undefined) speed = 400;
        var twEl = document.getElementById(divId);
        //console.log("can't find: ", twEl);
        if (twEl == null) return ;
        var opac = {o: twEl.style.opacity}
        if (opac.o == undefined || opac.o == null) opac.o = 1 - toOpacity;
        
        //opac.twEl = twEl;
        var opacTween = new TWEEN.Tween(opac, groupA).to({o:toOpacity}, speed)
           .onUpdate(function(){
            //console.log('this: ', this);
            twEl.style.opacity = this._object.o;
        })
        .delay(waitMili)

        return opacTween;
    }
    

    function addTwoGeometries(geom1, geom2, displace)
    {
        var newGeometry = new THREE.Geometry();
        for (var i = 0;i<geom1.vertices.length;i++)
        {
            var copyThisVert = geom1.vertices[i].clone();
            copyThisVert.destination = geom1.vertices[i].destination;
            copyThisVert.alpha = geom1.vertices[i].alpha;
            copyThisVert.color = geom1.vertices[i].color;
            copyThisVert.size = geom1.vertices[i].size;
            copyThisVert.r = geom1.vertices[i].r;
            copyThisVert.g = geom1.vertices[i].g;
            copyThisVert.b = geom1.vertices[i].b;
            copyThisVert.i = geom1.vertices[i].i;
            copyThisVert.static = true;
            copyThisVert.dest2 = geom1.vertices[i].dest2; 
            newGeometry.vertices.push(copyThisVert);
        }
        for (var i = 0;i<geom2.vertices.length;i++)
        {
            var copyThisVert2 = geom2.vertices[i].clone();
            copyThisVert2.x += displace;
            copyThisVert2.destination = geom2.vertices[i].destination;
            copyThisVert2.alpha = geom2.vertices[i].alpha;
            copyThisVert2.color = geom2.vertices[i].color;
            copyThisVert2.size = geom2.vertices[i].size;
            copyThisVert2.r = geom2.vertices[i].r;
            copyThisVert2.g = geom2.vertices[i].g;
            copyThisVert2.b = geom2.vertices[i].b;
            copyThisVert2.i = geom2.vertices[i].i;
            copyThisVert2.dest2 = geom2.vertices[i].dest2; 
            newGeometry.vertices.push(copyThisVert2);
        }
        return newGeometry;
    }
    

    function createGeomFromImageData(imgData, scaleSize, alphaAsSize) {

        if (alphaAsSize == undefined || alphaAsSize == null) alphaAsSize = false;
        if (scaleSize == undefined || scaleSize == null) scaleSize = 1;
        //scaleSize = scaleSize ;
        var geometry = new THREE.Geometry();
        for (var y = 0; y < imgData.height; y += 1)
        {
            for (var x = 0; x < imgData.width; x += 1)
            {   
                //console.log('checking[',x,'][',y,']: ', imgData.data[x*4  + y*4 * imgData.width])
                if (imgData.data[x*4  + y*4 * imgData.width] + imgData.data[x*4  + y*4 * imgData.width + 1] + imgData.data[x*4  + y*4 * imgData.width +2 ] > 0 ) {
                    var vert = new THREE.Vector3();
                    //vert.x = - Math.random() * 1000 + 500;
                    //vert.y = Math.random() * 1000 - 500;
                    //vert.z = Math.random() * 500 //- 500;


                    vert.destination = {
                        x: x - imgData.width / 2,
                        y: -y + imgData.height / 2,
                        z: 5
                    }
                    //console.log('generated geom x: ', vert.destination.x);
                    var xy = (y * 4) * imgData.width + x * 4;
                    vert.color = new THREE.Color('rgb(' + imgData.data[xy] + ', ' + imgData.data[xy+1] + ', ' + imgData.data[xy + 2] + ')');                    

                    vert.x = vert.destination.x;
                    vert.y = vert.destination.y;
                    vert.z = vert.destination.z;
                    vert.alpha = 1;                    
                    vert.size = 1 * scaleSize * defaultPixedSize;
                    //console.log('scalesize: ', scaleSize)
                    if (alphaAsSize){
                        vert.size = scaleSize * imgData.data[xy + 3]/255 * defaultPixedSize;
                        //console.log(' vert.size: ',  vert.size);  
                    } 

                    vert.speed = Math.random() / 200 + rloop.speedFactor;
                    geometry.vertices.push(vert);
                }
            }
        }

        return geometry;
    }

    function createThreeCirclesGeometry ( spritesPerCircle, raza1, zDistance, xDistance, numberOfCircles, center, sizeScale, firstScale, distort, sameScale, distanceMultiplier)
    {
        var geometry = new THREE.Geometry();
        if (distanceMultiplier == null || distanceMultiplier == undefined) distanceMultiplier = 1;
        for (var i = 0; i<numberOfCircles;i++)
        {
            for (var j = 0; j<spritesPerCircle; j++)
            {
                var vert = new THREE.Vector3();
                vert.x = - Math.random() * 1000 + 500;
                vert.y = Math.random() * 1000 - 500;
                vert.z = Math.random() * 500 //- 500;
                vert.destination = {
                    //x: (center.x + xDistance*i / 2) + (raza1 + xDistance*i) * Math.sin(2*j*Math.PI/spritesPerCircle + distort*i),
                    x: (center.x ) + (raza1 + xDistance*i) * Math.sin(2*j*Math.PI/spritesPerCircle + distort*i),
                    y: (center.y) + (raza1 + xDistance*i) * Math.cos(2*j*Math.PI/spritesPerCircle + distort*i),
                    z: (center.z) + (-zDistance*i)
                }
                if (distanceMultiplier>1) vert.destination.z = (center.z) + (-zDistance*i) * (i*distanceMultiplier);
                vert.size = i > 0 ?  firstScale / (i * sizeScale) * defaultPixedSize : firstScale * defaultPixedSize;
                if (sameScale) vert.size = firstScale * defaultPixedSize;
                //console.log('size:', vert.size)
                vert.color = new THREE.Color('rgb(0, 252, 254)');
                vert.speed = Math.random() / 200 + rloop.speedFactor;
                vert.alpha = 1;

                vert.x = vert.destination.x;
                vert.y = vert.destination.y;
                vert.z = vert.destination.z;

                geometry.vertices.push(vert);                
            }
        }

        return geometry;
    }
    

    function createGeometryFromInameData(imgData, img) {
        var geometry = new THREE.Geometry();
        
        var sprite = new THREE.TextureLoader().load("img/sprites/circleWhite.png");

        // uniforms
        
        uniforms = {
            color: { value: rloop.whiteColor },
            texture: { value: sprite }

        };

        material = new THREE.PointsMaterial({
            size: 1.7 * defaultPixedSize,
            color: 0xFFFFFF,
            sizeAttenuation: true,
            transparent:true,
            //alphaTest: 0.1,
            map:sprite
        });

        shaderMaterial = new THREE.ShaderMaterial({
            uniforms:       uniforms,
            vertexShader:   document.getElementById( 'vertexshaderP' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshaderP' ).textContent,
            
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite:false,
            transparent: true
            //transparent:    true,
            //alphaTest: 0.1
            //map: sprite
        })

        // var shaderMaterial = new THREE.ShaderMaterial( {

        //     uniforms:       uniforms,
        //     vertexShader: document.getElementById( 'vertexshader' ).textContent,
        //     fragmentShader: document.getElementById( 'fragmentshaderP' ).textContent,
        //     blending: THREE.AdditiveBlending,
        //     depthTest: false,
        //     depthWrite:false,
        //     transparent: true

        // } );



        //console.log('got data: ', imgData, 'img: ', img);
        //var bufferGeometry = new THREE.BufferGeometry().fromGeometry( geometry );
        
        for (var y = 0; y < imgData.height; y += 1)
        {
            for (var x = 0; x < imgData.width; x += 1)
            {   
                //console.log('checking[',x,'][',y,']: ', imgData.data[x*4  + y*4 * imgData.width])
                if (imgData.data[x*4  + y*4 * imgData.width] > 0 ) {
                    var vert = new THREE.Vector3();
                    vert.x = - Math.random() * 1000 + 500;
                    vert.y = Math.random() * 1000 - 500;
                    vert.z = Math.random() * 500 //- 500;
                    var xy = (y * 4) * imgData.width + x * 4;
                    vert.color = new THREE.Color('rgb(' + imgData.data[xy] + ', ' + imgData.data[xy+1] + ', ' + imgData.data[xy + 2] + ')');
                    //console.log(vert.color);
                    vert.size = 1 * defaultPixedSize;
                    vert.destination = {
                        x: x - imgData.width / 2,
                        y: -y + imgData.height / 2,
                        z: -10
                    }
                    vert.alpha = 1;
                    // vert.x = vert.destination.x;
                    // vert.y = vert.destination.y;
                    //vert.z = vert.destination.z;

                    vert.speed = Math.random() / 200 + rloop.speedFactor;                    
                    geometry.vertices.push(vert);
                    //attributes.alpha.value[ geometry.vertices.length-1 ] = 1;
                }
            }
        }

        // /createThreeCirclesGeometry ( spritesPerCircle, raza1, zDistance, xDistance, numberOfCircles, center, scaleFactor, firstScale )
        //var testGeometry = createThreeCirclesGeometry(50, 15, 5, 2.5, 4, 0, 1.7, 1.2)
        //geometry = testGeometry;
        var bufferGeometry = new THREE.BufferGeometry();
        var positions = new Float32Array(geometry.vertices.length * 3) ;
        var colors = new Float32Array(geometry.vertices.length * 3) ;
        var sizes = new Float32Array( geometry.vertices.length );
        var alphas = new Float32Array( geometry.vertices.length * 1 ); // 1 values per vertex
        //var color = new THREE.Color();

        //console.log('before: ', geometry.vertices.length);
        
        //console.log('after: ', geometry.vertices.length);
        for (var i = 0, i3 = 0; i< geometry.vertices.length; i++, i3+=3)
        {
            color = geometry.vertices[i].color;
            positions[i3 + 0] = geometry.vertices[i].x;
            positions[i3 + 1] = geometry.vertices[i].y;
            positions[i3 + 2] = geometry.vertices[i].z;

            colors[ i3 + 0 ] = color.r;
            colors[ i3 + 1 ] = color.g;
            colors[ i3 + 2 ] = color.b;
            
            sizes[ i ] = geometry.vertices[i].size * defaultPixedSize;
            alphas[ i ] = geometry.vertices[i].alpha;// Math.random();
        }
        bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        bufferGeometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
        bufferGeometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
        bufferGeometry.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );
        //console.log('geometry: ', bufferGeometry);
        var numVertices = bufferGeometry.attributes.position.count;
        
        bufferGeometry.attributes.customColor.needsUpdate = true;
        var particles = new THREE.Points(geometry, material);
        var bufferParticles = new THREE.Points(bufferGeometry, shaderMaterial);

        //console.log('particles: ', particles);
        return {
            particles:particles,
            bParticles: bufferParticles
        };        
    }

    function updateTheBufferGeometryToMoreParticles ( morePosition )
    {
        var newBufferGeometry = new THREE.BufferGeometry();
        var positions = rloop.bufferParticles.geometry.attributes.position.array;
        var colors = rloop.bufferParticles.geometry.attributes.customColor.array;
        var sizes = rloop.bufferParticles.geometry.attributes.size.array;
        var alphas = rloop.bufferParticles.geometry.attributes.alpha.array;

        var positionsNew = new Float32Array((sizes.length + morePosition) * 3) ;
        var colorsNew = new Float32Array((sizes.length + morePosition) * 3) ;
        var sizesNew = new Float32Array((sizes.length + morePosition) );
        var alphasNew = new Float32Array( (sizes.length + morePosition) * 1 );

        for (var j = 0; j< sizesNew.length; j++)
        {
            colorsNew[ j*3 + 0 ] = 1;
            colorsNew[ j*3 + 1 ] = 1;
            colorsNew[ j*3 + 2 ] = 1;
        }

        for (var i = 0, i3 = 0;i<sizes.length; i++, i3+=3)
        {
            positionsNew[i3 + 0] = positions[i3];
            positionsNew[i3 + 1] = positions[i3 + 1];
            positionsNew[i3 + 2] = positions[i3 + 2];

            colorsNew[ i3 + 0 ] = colors[ i3 + 0 ]
            colorsNew[ i3 + 1 ] = colors[ i3 + 1 ]
            colorsNew[ i3 + 2 ] = colors[ i3 + 2 ]
            
            sizesNew[ i ] = sizes [ i ];
            alphasNew[ i ] = alphas [ i ];
        }

        newBufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( positionsNew, 3 ) );
        newBufferGeometry.addAttribute( 'customColor', new THREE.BufferAttribute( colorsNew, 3 ) );
        newBufferGeometry.addAttribute( 'size', new THREE.BufferAttribute( sizesNew, 1 ) );
        newBufferGeometry.addAttribute( 'alpha', new THREE.BufferAttribute( alphasNew, 1 ) );
                
        newBufferGeometry.attributes.customColor.needsUpdate = true;
        newBufferGeometry.attributes.position.needsUpdate = true;
        newBufferGeometry.attributes.alpha.needsUpdate = true;
        newBufferGeometry.attributes.size.needsUpdate = true;

        //console.log('old geom: ', rloop.bufferParticles.geometry.attributes.size.array.length);
        rloop.bufferParticles.geometry.dispose();
        rloop.bufferParticles.geometry.copy ( newBufferGeometry );
        //console.log('needed geom: ', newBufferGeometry.attributes.size.array.length)
        //console.log('new geom: ', rloop.bufferParticles.geometry.attributes.size.array.length)
    }
    
    function updateNewBufferGeometryFromGeometry( newGeometry ) {
        var bufferGeometry = new THREE.BufferGeometry();
        var positions = new Float32Array(newGeometry.vertices.length * 3) ;
        var colors = new Float32Array(newGeometry.vertices.length * 3) ;
        var sizes = new Float32Array( newGeometry.vertices.length );
        var alphas = new Float32Array( newGeometry.vertices.length * 1 ); // 1 values per vertex

        for (var i = 0, i3 = 0; i< newGeometry.vertices.length; i++, i3+=3)
        {
            color = newGeometry.vertices[i].color;
            positions[i3 + 0] = newGeometry.vertices[i].x;
            positions[i3 + 1] = newGeometry.vertices[i].y;
            positions[i3 + 2] = newGeometry.vertices[i].z;

            colors[ i3 + 0 ] = color.r;
            colors[ i3 + 1 ] = color.g;
            colors[ i3 + 2 ] = color.b;
            
            sizes[ i ] = newGeometry.vertices[i].size * defaultPixedSize;
            alphas[ i ] = newGeometry.vertices[i].alpha;
        }
        bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        bufferGeometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
        bufferGeometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
        bufferGeometry.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );

        var numVertices = bufferGeometry.attributes.position.count;
                
        bufferGeometry.attributes.customColor.needsUpdate = true;
        bufferGeometry.attributes.position.needsUpdate = true;
        bufferGeometry.attributes.alpha.needsUpdate = true;
        bufferGeometry.attributes.size.needsUpdate = true;

        //var particles = new THREE.Points(geometry, material);
        var bufferParticles = new THREE.Points(bufferGeometry, shaderMaterial);

        //console.log('particles: ', particles);
        return bufferParticles;
    }   
    

    function animateOut(currentStep)
    {
        switch (currentStep)
        {
            case 0:
                for (var i = 0;i<rloop.particles.geometry.vertices.length;i++)
                {
                    var vert = rloop.particles.geometry.vertices[i];

                    vert.destinationOld = {
                        x: vert.destination.x+0.001,
                        y: vert.destination.y+0.001,
                        z: vert.destination.z+0.001
                    }
                    vert.destination = {
                        x: - Math.random() * 1000 + 500,
                        y: Math.random() * 1000 - 500,
                        z: Math.random() * 500
                    }
                    vert.speed = Math.random() / 200 + rloop.speedFactor;
                    vert.back = true;
                }
                rloop.animating = true;
                break;
        }
    }
    

    function addLight3D() {

        ambientLight = new THREE.AmbientLight(0xEEEEEE, 0.5)
            //rloop.scene.add(ambientLight);
        directionalLight = new THREE.SpotLight(0xffffff, 1);
        directionalLight.position.set(-185, 155, 150);
        directionalLight.castShadow = false;

        rloop.scene.add(directionalLight)

        //directionalLight.shadow.mapSize.width = 4024;
        //directionalLight.shadow.mapSize.height = 4024;
        //directionalLight.shadow.camera.near = 100;
        //directionalLight.shadow.camera.far = 200;
        //directionalLight.shadow.camera.fov = 70;
        //directionalLight.target.position.normalize();
        //directionalLight.target.position.set( 0, 0, 1000 );
        //directionalLight.target.position.set( 0, 0, 50 );
        //directionalLight.shadowMapVisible = true;        
        //simSphere.scene.add( directionalLight );
        //spotLight = new THREE.SpotLight( 0xffffff , 1);
        //spotLight.position.set(260, 280, 300 );
        //spotLight.castShadow = false;
        /*
        spotLight.shadow.mapSize.width = 4096;
        spotLight.shadow.mapSize.height = 4096;
        spotLight.shadow.camera.near = 100;
        spotLight.shadow.camera.far = 500;
        spotLight.shadow.camera.fov = 80;
        */
        //simSphere.scene.add( spotLight );
        var dirLight = new THREE.DirectionalLight(0xf2f2f2, 0.9);
        dirLight.position.set(100, 1000, 50);
        rloop.scene.add(dirLight);

        // var ambLight = new THREE.HemisphereLight(0xfef9f0, 0xFFFFFF, 0.1);
        // rloop.scene.add(ambLight);
    }

    function addStats() {
        //adding stats

        stats = new Stats();
        stats.showPanel(1);
        document.body.appendChild(stats.dom);
    }

    function getImageData(image) {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        return ctx.getImageData(0, 0, image.width, image.height);
    }  

    function getShort(longUrl) {
        for (var i=0;i<imageSteps.length;i++)
        {
            if (longUrl.indexOf(imageSteps[i]) >= 0)
                return imageSteps[i];
        }

    }

    /*** helper function ***/

    function webglAvailable() {
        //return false;
        try {
            var canvas = document.createElement("canvas");
            return !!
                window.WebGLRenderingContext &&
                (canvas.getContext("webgl") ||
                    canvas.getContext("experimental-webgl"));
        } catch (e) {
            return false;
        }
    }

    function strongEaseOut(t, d){
      return 1 - Math.pow(1 - (t / d), 2);
    }

    function getRandom(arr, n) {
        var result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len;
        }
        return result;
    }

    
    function runTimer()
    {
        enableNext = false;
        //console.log('running timer')
        var tim = setTimeout(function(){
            enableNext = true;
        }, 1750);
    }

    var timeoutDuration = 400;
    var resizeTimeout = null;
    window.addEventListener('resize', function(event) {
      
    });


    function addScenes(newScenes) {
      // reset active scenes
      activeScenes = [];
      // loop over each scene and add/re-add
      newScenes.forEach(function (newScene, index) {
        if (typeof newScene === 'function') {
          // add the new scene
          var newScene = newScene();
          // push it to our active scenes array
          activeScenes.push(newScene);
        }
      });
    }

    function onWindowResize(e){
        //console.log('resized');
        
        var maxWindowSize = window.innerHeight;// - 120// - widthJos;
        if (rloop.portrait) maxWindowSize = window.innerHeight * 0.80 ;
                
        var portrait = false;
        if(window.innerHeight > window.innerWidth){
            portrait = true;
        }

        // if (resizeTimeout) {
        //     clearTimeout(resizeTimeout);
        //   }
        //   resizeTimeout = setTimeout(function() {
        //     // loop over each active scene
        //     slidesScenes.forEach(function (scene, index) {
        //       // make sure scene wasn't null
        //       if (scene) {
        //         // destroy active scene
        //         console.log('scene:', scene)
        //         scene.destroy(true);
        //       }
        //     });
        //     // after we have destroyed old scenes, re-add them
        //     createScenes();
        //   }, timeoutDuration);
        
        if (portrait) {
            var durr = currentPage * 500;
            currentPage = 0;
            tweenIconsOutAllStep2();
            tweenLogosOutStep1();
            tweenLogosOutStep2();
            gotoPageAndFade(0, -1, durr);
            //scrollMagicController.enabled(false);
            return;
        } else {
            //scrollMagicController.enabled(true);
        }

        setTheStyle.set_layout();
        var heightRatio = screen.availHeight / (600);//*window.devicePixelRatio);
        if (portrait) heightRatio = screen.availWidth / (500);

        if (heightRatio>1) heightRatio=1;

        rloop.portrait = portrait;

        if (rloop.mobile)
        {
            
        }

        var viewport = document.querySelector("meta[name=viewport]");
        //viewport.setAttribute('content', 'width=device-width, initial-scale='+heightRatio+', maximum-scale=1.0, user-scalable=0');
        //hardcoded 0.8 heightRatio ca pare ca merge mai bine
        //if (portrait) viewport.setAttribute('content', 'width=device-width, initial-scale='+0.8+', maximum-scale=1.0, user-scalable=0');

        container = document.getElementById("webGLContent");
        width = container.clientWidth;
        height = container.clientHeight;

        height = window.innerHeight;// - heightOffset;
        width = rloop.camera.aspect * height;
        width = window.innerWidth;
        height = width / rloop.camera.aspect;
        height = window.innerHeight;

        //document.getElementById("webGLCanv").style.height = height + 'px';           
        //document.getElementById("webGLCanv").style.width = width + 'px';

        // if (rloop.mobile && rloop.portrait) 
        // {
        //     height = height * 0.85;
        //     document.getElementById("webGLCanv").style.height = height + 'px';           
        //     document.getElementById("webGLCanv").style.width = width + 'px';
        // }  
        
        //console.log('fromValue: ', prevValue, 'to value: ', width, height );

        var zoomFromStandard = window.innerWidth / (1600 ) ;
        //console.log('zoomFromStandard: ', zoomFromStandard);

        /*
        if (zoomFromStandard) { //} && window.devicePixelRatio<=1) {
            //camFOV = 45 / (zoomFromStandard*1.2);
            if (portrait) camFOV = 45 / (zoomFromStandard*1.1);
            else camFOV =  55 / (zoomFromStandard*1.0);
            //defaultPixedSize = 1 * (zoomFromStandard * 1.8);
            //if (defaultPixedSize>1) defaultPixedSize = 1;
            //console.log('changing fov: ', camFOV);
            if (camFOV<45) camFOV = 45;
            rloop.camera.fov = camFOV;
            rloop.camera.updateProjectionMatrix();
        }
        */

        if (zoomFromStandard<1) { //} && window.devicePixelRatio<=1) {
            camFOV = 45 / (zoomFromStandard*1.1);
            if (portrait) camFOV = 45 / (zoomFromStandard*1.1)
            //defaultPixedSize = 1 * (zoomFromStandard * 1.8);
            //if (defaultPixedSize>1) defaultPixedSize = 1;

            rloop.camera.fov = camFOV;
            //rloop.camera.aspect = th.width / th.height;
            rloop.camera.updateProjectionMatrix();
        }
        //if (window.devicePixelRatio > 1 && !rloop.mobile) defaultPixedSize = defaultPixedSize / 2;
        //console.log('cam fov: ', rloop.camera.fov, 'zoom from standard: ', zoomFromStandard);

        //document.getElementById('coin').style.

        rloop.renderer.setSize( width, height );
        if (prevValue.width != width || prevValue.height!=height)
        {
            //console.log('fromValue: ', prevValue, 'to value: ', width, height );
            var glTween = new TWEEN.Tween(prevValue)
                    .to({width: width, height: height}, 200)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .onUpdate(function(){
                        //document.getElementById("webGL").style.height = this.height+'px';
                        //document.getElementById("webGL").style.width = this.width+'px';
                        var th = {
                            width: parseInt(this._object.width),
                            height: parseInt(this._object.height)
                        }
                        //console.log('updating this: ', this);
                        container.style.top = (window.innerHeight - th.height)/2 + 'px';
                        rloop.camera.aspect = th.width / th.height;
                        rloop.camera.updateProjectionMatrix();
                        //rloop.renderer.setSize( th.width, th.height );

                    })
                    .start();
        }
        // if (!portrait) {
        //     scrollMagicController.enabled(true);
            
        // }
    }

    return rloop;
});