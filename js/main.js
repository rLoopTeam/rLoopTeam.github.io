define(["rloop"], function(rloop){
    
    var main = {};

    /***private fields***/

    var width, height;
    var isMobile = false; //initiate as false
    var portrait = false;
    var started = false;
    /***public functions***/

    main.Init = function(){

        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
        maxWindow(isMobile);        
        //getData();
        // Find the right method, call on correct element


        // Launch fullscreen for browsers that support it!
        launchFullScreen(document.documentElement); // the whole page
        //launchFullScreen(document.getElementById("videoElement")); // any individual element
        console.log('portrait:', portrait)
        if (portrait) {
            document.getElementById('logoinMiddle').style.visibility = 'visible';
            document.getElementById('plsRotateText').style.display = 'block';
        } else {    
            document.getElementById('preloadScreen').style.visibility = 'hidden';
            rloop.PreInit(isMobile, portrait);//, data);
            started = true;
        }
        window.addEventListener('resize', checkOrientation);
    };


    function getData()
    {
        //var full = location.protocol+'//mobilalaguna.ro/mobilier/?listProductsForSimulator&category_id=67';
        var url = 'json/projects.json';
        $.ajax({
            url : url,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                //console.log('data2 : ', data);
                document.getElementById('preloadScreen').style.visibility = 'hidden';
                rloop.PreInit(isMobile, data);
            }, 

            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("Status: " + textStatus + " Error: " + errorThrown);
                //document.getElementById('preloadScreen').style.visibility = 'hidden';
                rloop.PreInit(false);
            }  
        })
    }

    function launchFullScreen(element) {
      if(element.requestFullScreen) {
        element.requestFullScreen();
      } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if(element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      }
    }

    function maxWindow(isM) {
        
        if(window.innerHeight > window.innerWidth){
            portrait = true;
        }
        //console.log('dev px ratio: ',window.devicePixelRatio);
        if (isM)
        {
            hideAddressBar();
            var heightRatio = screen.availHeight / (700);//*window.devicePixelRatio);
            if (portrait) heightRatio = screen.availWidth / (600);
            // viewport = document.querySelector("meta[name=viewport]");
            // viewport.setAttribute('content', 'width=device-width, initial-scale='+heightRatio+', maximum-scale=1.0, user-scalable=0');

            window.moveTo(0, 1);
            if (document.all) {
                top.window.resizeTo(screen.availWidth, screen.availHeight);
            }

            else if (document.layers || document.getElementById) {
                if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
                    top.window.outerHeight = screen.availHeight;
                    top.window.outerWidth = screen.availWidth;
                }
            }
        }
        
    }

    function hideAddressBar()
    {
        if(!window.location.hash)
        {
            if(document.height < window.outerHeight)
            {
                document.body.style.height = (window.outerHeight + 50) + 'px';
            }
            setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
        }
    }

    function checkOrientation(e) {
        if(window.innerHeight > window.innerWidth){
            portrait = true;
        } else portrait = false;

        //if (portrait) blockScreen();
        if (!portrait) {
            document.getElementById('logoinMiddle').style.visibility = 'hidden';
            document.getElementById('plsRotateText').style.display = 'none';
            document.getElementById('preloadScreen').style.visibility = 'hidden';
            if (!started) rloop.PreInit(isMobile, portrait);//, data);
            started = true;
        } else {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('logoinMiddle').style.visibility = 'visible';
            document.getElementById('plsRotateText').style.display = 'block';
            document.getElementById('preloadScreen').style.visibility = 'visible';

        }
    } 

    function doOnOrientationChange(e) {
        console.log('window orientation: ', e)
        switch(window.orientation) {  
          case -90 || 90:
            //alert('landscape');
            break; 
          default:
            //alert('portrait');
            break; 
        }
    }
   
    return main;
});