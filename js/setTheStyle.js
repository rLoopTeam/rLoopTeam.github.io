define([], function() {
	var setTheStyle = {

	}

	setTheStyle.set_layout = function() {
        
      var ww = window.innerWidth,
          wh = window.innerHeight,
          ratio = ww / wh,
          mobility,
          mob0h = 0.57,
          mob1h = 1.5;
      if (ratio * mob0h > 1) {
        mobility = 1 - ratio * mob0h;
      } else if (ratio * mob1h < 1) {
        mobility = 1;
      } else {
        mobility = 1 - (1 / ratio - mob1h) / (mob0h - mob1h);
      }
      // mobility = 1;
      //console.log(mobility);
      var w = mobility < 0 ? 1 / (1 - mobility) : 1,
          pad = 50 / w - 50;
      function len(num) {
        return (w * num).toFixed(2) + 'vw';
      }
      if (mobility > 0.5) {
        set_lines(3);
      } else {
        set_lines(2);
      }
      var logo_pos = {
        /*left: 5 
          /*blend(
          pad + 5.19,
          8.503,
          mobility
        , */
        top: blend(
          3.602,
          6.259,
          mobility
        ),
        width: blend(
          11.506,
          26.228,
          mobility
        ),
        height: blend(
          6.037,
          13.761,
          mobility
        ),
      };
      //console.log('')
      set_css('logo', map_pos(logo_pos, len));      


      // set_css('logo-click-area', map_pos(expand_pos(
      //   logo_pos, 1.3
      // ), len));
      // set_css('logo-click-area', {background: 'rgba(255, 0, 0, 0.1)'});
      var font_size = len(blend(
        2.4,
        3.4,
        mobility
      ));
      set_css('pre-block', {
        left: 0,
        right: 0,
        top: len(blend(
          17.05,
          62.37,
          mobility
        )),
        fontSize: font_size,
      });
      set_css('post-block1', {
        top: len(blend(
          35.6,
          95,
          mobility
        )),
        lineHeight: 1.25,
        fontSize: len(blend(
          2.4,
          4.5,
          mobility
        ))
      });
      font_size = len(blend(
        1.05,
        2.3,
        mobility
      ));
      set_css('post-block2', {
        top: len(blend(
          42.5,
          114,
          mobility
        )),
        fontSize: font_size,
        lineHeight: 1.6,
      });
      set_css('post-block3', {
        left: 0,
        right: 0,
        top: len(blend(
          46.21,
          127,
          mobility
        )),
        fontSize: font_size,
        lineHeight: blend(
          1.8,
          2.2,
          mobility
        ),
      });
      set_css('post-block31', {
        left: 0,
        right: 0,        
        fontSize: font_size,
        lineHeight: blend(
          1.8,
          2.2,
          mobility
        ),
      });
      set_css('post-block4', {
        left: 0,
        right: 0,
        top: len(blend(
          50.8,
          139.47,
          mobility
        )),
        fontSize: len(blend(
          1.2,
          2.8,
          mobility
        )),
      });

      set_css('txtTitl', {
        lineHeight: 2.25,
        fontSize: len(blend(
          2.2,
          4.2,
          mobility
        ))
      });

      set_css('mainTxt', {
        lineHeight: 1.25,
        fontSize: len(blend(
          2.2,
          4.1,
          mobility
        ))
      });

      set_css('txtTitl3', {
        lineHeight: 2.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt3', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('bottomTxt3', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.4,
          3.2,
          mobility
        ))
      });

      set_css('txtTitl5', {
        lineHeight: 2.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt5', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('bottomTxt5', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.4,
          3.2,
          mobility
        ))
      });

      set_css('txtTitl4', {
        lineHeight: 2.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt4', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('bottomTxt4', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.4,
          3.2,
          mobility
        ))
      });

      set_css('txtTitl6', {
        lineHeight: 2.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt6', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt7', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt8', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt9', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('txtTitl10', {
        lineHeight: 2.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt10', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('bottomTxt10', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.4,
          3.0,
          mobility
        ))
      });

      set_css('txtTitl11', {
        lineHeight: 2.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt11', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('bottomTxt11', {
        lineHeight: 1.5,
        fontSize: len(blend(
          1.4,
          3.0,
          mobility
        ))
      });

      // set_css('bottomTxt211', {
      //   lineHeight: 1.5,
      //   fontSize: len(blend(
      //     1.4,
      //     3.0,
      //     mobility
      //   ))
      // });

      set_css('txtTitl12', {
        lineHeight: 2.25,
        fontSize: len(blend(
          1.6,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt12', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('bottomTxt12', {
        lineHeight: 1.5,
        fontSize: len(blend(
          1.4,
          3.0,
          mobility
        ))
      });

      set_css('txtTitl13', {
        lineHeight: 2.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt13', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('bottomTxt13', {
        lineHeight: 1.5,
        fontSize: len(blend(
          1.4,
          3.0,
          mobility
        ))
      });

      set_css('txtTitl14', {
        lineHeight: 2.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt14', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('bottomTxt14', {
        lineHeight: 1.5,
        fontSize: len(blend(
          1.4,
          3.0,
          mobility
        ))
      });

      set_css('txtTitl15', {
        lineHeight: 2.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('mainTxt15', {
        lineHeight: 1.25,
        fontSize: len(blend(
          1.8,
          3.7,
          mobility
        ))
      });

      set_css('bottomTxt15', {
        lineHeight: 1.5,
        fontSize: len(blend(
          1.4,
          3.0,
          mobility
        ))
      });

      set_css('post-block5', {
        left: 0,
        right: 0,
        top: len(blend(
          50.8,
          139.47,
          mobility
        )),
        fontSize: len(blend(
          1.2,
          2.8,
          mobility
        )),
      });

      set_css('buttonsCont', {top: len(blend(
          3.602,
          6.259,
          mobility
        ))});
            

      var bg_w = len(blend(105, 140, mobility)),
          bg_h = len(blend(75, 110, mobility)),
          bg_x = blend(50, 50, mobility) + '%',
          bg_y = len(blend(-15, 14, mobility)),
          bg_size = bg_w + ' ' + bg_h + ', 100vw ' + bg_h;
      if (ratio > 0.5) {
          bg_size = bg_size + ', ' + bg_w + ' 100vh';
      } else {
          bg_size = bg_size + ', ' + bg_w + ' 100px';
      }
      set_css('body', {
        backgroundImage: 'url(img/bg/pod_conv.jpg), url(img/bg/pod_h.png), url(img/bg/pod_v.png)',
        backgroundSize: bg_size,
        backgroundPosition: bg_x + ' ' + bg_y + ', 0 ' + bg_y + ', ' + bg_x + ' 0%',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
        // height: len(blend(100 * (mob0h - 0.03), 100 * (mob1h - 0.03), mobility)),
      });
      if (mobility <= 0.3) {
        window.race_is_on = window.race_is_on_1;
        window.race_is_on_pos = {
          top: blend(23, 70, mobility) * w,
          width: 90 * w,
          height: 7 * w,
        };
      } else if (mobility <= 0) {
        window.race_is_on = window.race_is_on_2;
        window.race_is_on_pos = {
          top: blend(40, 50, mobility) * w,
          width: blend(80, 80, mobility) * w,
          height: blend(300, 300, mobility) * w,
        };
      } else {
        window.race_is_on = window.race_is_on_3;
        window.race_is_on_pos = {
          top: blend(5, 40, mobility) * w,
          width: blend(200, 48, mobility) * w,
          height: blend(45, 87, mobility) * w,
        };
      }
      window.hyperloop_pos = {
        top: blend(22.5, 72, mobility) * w,
        width: blend(64, 91, mobility) * w,
        height: blend(9, 10, mobility) * w,
      };
  	}

  	function set_css(elem_id, style) {
  		//console.log('elem_id:', elem_id);
      
	  var elem = id(elem_id);
	  for (var prop in style) {
	    elem.style[prop] = style[prop];
	  }
    if (elem_id=='buttonsCont') {
        // console.log('buttonsCont: ', elem.style);
      }
	}

	function set_lines(count) {
	  var post1 = [
	    'rLoop is delivering the vision for ', 'the Hyperloop. ',
	    'Now you can be ', 'part of the engineering revolution. ',
	  ],
	  post2 = [
	    "For over two years, we've created the world's top Hyperloop technology as ", "a decentralised team. Now we are ",
	    'bringing the Hyperloop onto ', 'the Blockchain, allowing individuals to own and be part of the future. ',
	  ];
	      br = '<br />';
	  if (count == 2) {
	    id('post-block1').innerHTML = [post1[0] + post1[1], post1[2] + post1[3]].join(br);
	    id('post-block2').innerHTML = [post2[0] + post2[1], post2[2] + post2[3]].join(br);
	  } else if (count == 3) {
	    id('post-block1').innerHTML = [post1[0], post1[1] + post1[2], post1[3]].join(br);
	    id('post-block2').innerHTML = [post2[0], post2[1] + post2[2], post2[3]].join(br);
	  }
	}

	function expand_pos(pos, factor) {
	  return {
	    top: pos.top - pos.height * (factor - 1) / 2,
	    left: pos.left - pos.width * (factor - 1) / 2,
	    width: pos.width * factor,
	    height: pos.height * factor,
	  };
	}

	function map_pos(pos, fun) {
	  var res = {};
	  for (var key in pos) {
	    res[key] = fun(pos[key]);
	  }
	  return res;
	}

	function id(id) {
	  return document.getElementById(id);
	}

	function blend(a, b, t) {
	  t = clamp01(t);
	  return a * (1 - t) + b * t;
	}

	function clamp(min, max, t) {
	  if (t < min) return min;
	  if (t > max) return max;
	  return t;
	}

	var clamp01 = clamp.bind(null, 0, 1);

  	return setTheStyle;

});