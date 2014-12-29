jQuery(document).ready(function(){
  TweenLite.ticker.fps(60);
  var $box        = $('#box'),
      $box2       = $('#box2'),
      $spans      = $box.find('span'),
      $model      = $($spans[0]),
      $view       = $($spans[1]),
      $vm         = $($spans[2]),
      $modelText  = $model.find('h1'),
      $viewText   = $view.find('h1'),
      $vmText     = $vm.find('h1'),
      $bottom     = $('.bottom'),
      $left       = $('.left'),
      $right      = $('.right'),
      $top        = $('.top'),

      $line       = $('.line'),
      $title1     = $('.line .c'),
      $container  = $('.contaienr'),
      $components = $('.components > .component');


      var $config = {
        rowList: $('.row-list')
      }

    function line(){
      var toggleTitle = new TimelineLite();
          toggleTitle.to($title1, 1, {autoAlpha:1})
               .to($title1, 0.1, {autoAlpha:0, delay:1})

      var showComponents = TweenMax.to($components, 1, {autoAlpha:1})

      var time = new TimelineLite();
      time
        .to($line, 0.3, {height:'100px', marginTop:"-=25px", width:'200px', marginLeft: '-100px', ease:Cubic.easeOut, delay:1, borderRadius:0})
        .add(toggleTitle)
        .to($line, 0.2, {height:'20px'}, 3.5)
        .to($line, .5, {rotation:'180deg', width:'10px', left:'0', marginLeft:'20px', marginTop:'0', top:'0'})
        .to($line, .5, {height:'100%'})
        .add(showComponents)
        .to($line, .5, {left:'-100%'})
    }

    line()

    function intro(){
      $container  = $('#container');
      var tl = new TimelineLite()
      tl.from($model, 2, {
          top:'-600%',
          ease:Bounce.easeOut
      })
      tl.to($model, .5, {
          borderRadius:'5px',
          width:'100px',
          height:'100px',
          marginLeft:'-50px',
          ease:'Cubic.easeOut',
          delay:1})
        .to($model, .5, {
          borderRadius:'0',
          width:'150px',
          height:'150px',
          marginLeft:'-75px',
          ease:'Cubic.easeOut',
        })
        .to($modelText, .5, {autoAlpha:1}, 3.5)
        .to($model, .5, {
          fontSize:'3em',
          height:'100px',
        })
        .to($view, .5, {
          opacity:1,
          zIndex:5
        })
        .to($viewText, .5, {
          autoAlpha:1,
        }, 4.5)
        .to($model, .5, {
          left:'-=150px'
        }, 4.5)
        .to($model, .5, {
          left:'0px',
          margin:0
        }, 4.5)
        .to($view, .5, {
          left:'145px',
          margin:0
        }, 4.5)
        .to($vm, .5, {
          autoAlpha:1
        })
        .to($vm, 1, {
          ease:Bounce.easeOut,
          right:0
        }, 5)
        .to($vmText, .5, {
          autoAlpha:1
        }, 5)
        .to($box, 1, {
          minWidth:'100%',
          height:'100px',
          minHeight:'100px'
        })
        .to($container, .5, {
          top:'50%',
          left:'50%',
          marginLeft:'-300px'
        },6)
        .to([$view, $model, $vm], .5, {
          boxShadow:'0 0 0',
        }, 6)
        .to([$view, $model, $vm], .5, {
          backgroundColor:'none',
        }, 6.5)
        .to($box, 1, {
          backgroundColor:'#69F0AE',
          boxShadow:'0px 2px 4px rgba(0,0,0,.4)',
          onComplete:next
        },7)
    }



    $config.rowList.append($('<div>').addClass('list-divider'));

})