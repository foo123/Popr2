/**
* Popr 2.0.0
* Copyright (c) 2015 Tipue
* popr is released under the MIT License
* http://www.tipue.com/popr
* https://github.com/foo123/Popr2
**/
!function($){
"use strict";

function viewport( ) 
{
    var m = document.compatMode == 'CSS1Compat';
    return {
        l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
        t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
        w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
        h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
    };
}
function offset( el )
{
    // http://stackoverflow.com/a/4689760/3591273
    var box = el.getBoundingClientRect(),
        body = document.body, win = window,
        clientTop  = body.clientTop  || 0,
        clientLeft = body.clientLeft || 0,
        scrollTop  = win.pageYOffset || body.scrollTop,
        scrollLeft = win.pageXOffset || body.scrollLeft,
        top  = box.top  + scrollTop  - clientTop,
        left = box.left + scrollLeft - clientLeft;
    return {top: top, left: left, width: el.offsetWidth, height: el.offsetHeight };
}

$.fn.popr2 = function( options ) {
    var set = $.extend( {
        'selector'     : '.popr',
        'activate'     : 'click',
        'attribute'    : 'data-popr',
        'speed'        : 300,
        'mode'         : 'bottom'
    }, options||{});
    set.selector = set.selector || '.popr';
    set.activate = set.activate || 'click';
    set.attribute = set.attribute || 'data-popr';
    
    $(this).on(set.activate, set.selector, function(event) {
        event.stopPropagation( );
        var el = this, $el = $(el);
        $('.popr_container').remove( );

        var d_m = set.mode, attr_mode = $el.attr('data-popr-mode');
        if ( !!attr_mode ) d_m = attr_mode;

        var popr_cont = $('<div class="popr_container popr_container_' + d_m + '"><div class="popr_point"><div class="popr_content">' + $('#' + $el.attr(set.attribute)).html( ) + '</div></div></div>').appendTo('body');

        var pos = offset( el ), viewPort = viewport( ), 
            w = popr_cont.outerWidth(), h = popr_cont.outerHeight()/* + 39*/,
            top = pos.top + pos.height, left = pos.left + (pos.width-w)/2
        ;
        if ( 'top' == d_m || top + h > viewPort.t + viewPort.h )
        {
            top -= pos.height + h;
            if ( 'bottom' == d_m )
            {
                d_m = 'top';
                popr_cont.removeClass('popr_container_bottom').addClass('popr_container_top');
            }
        }
        if ( left + w > viewPort.l + viewPort.w )
        {
            left -= w;
        }
        popr_cont.css({ left:left+'px', top:top+'px' }).fadeIn( set.speed );
        
        $('body').on('mouseup.popr2 keyup.popr2', function popr_hide( evt ){
            // outside click or ESC key pressed
            if ( 'mouseup' === evt.type || 27 === evt.which )
            {
                $('body').off('mouseup.popr2 keyup.popr2');
                setTimeout(function( ) {
                    $('.popr_container').remove( );
                }, 40);
            }
        });
    });
};
}(jQuery);