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

var global_handler_added = false;
var window_resize_added = false;

function popr_adjust( popr, target )
{
    var pos = offset( target ), viewPort = viewport( ), 
        w = popr.outerWidth(), h = popr.outerHeight(),
        top = pos.top + pos.height, left = pos.left + (pos.width-w)/2
    ;
    if ( popr.hasClass('popr_container_top') || top + h > viewPort.t + viewPort.h )
    {
        top -= pos.height + h;
        if ( popr.hasClass('popr_container_bottom') )
            popr.removeClass('popr_container_bottom').addClass('popr_container_top');
    }
    if ( left < viewPort.l )
    {
        left = pos.left + pos.width;
        popr.addClass('popr_container_right');
    }
    else if ( left + w > viewPort.l + viewPort.w )
    {
        left = pos.left - w;
        popr.addClass('popr_container_left');
    }
    return popr.css({ left:left+'px', top:top+'px' });
}

$.fn.popr2 = function( options ) {
    var set = $.extend( {
        'selector'     : '.popr',
        'attribute'    : 'data-popr',
        'activate'     : 'click',
        'class'        : '',
        'mode'         : 'bottom'
    }, options||{}), activate_type, activate_event;
    set.selector = set.selector || '.popr';
    set.activate = set.activate || 'click';
    set.attribute = set.attribute || 'data-popr';
    
    if ( 'mouseup' === set.activate )
    {
        activate_event = set.activate+'.popr2box';
        activate_type = set.activate;
    }
    else
    {
        activate_event = set.activate + '.popr2box mouseup.popr2box';
        activate_type = set.activate;
    }
    $(this).on(activate_event, set.selector, function(event) {
        event.stopPropagation( );
        if ( activate_type !== event.type ) return false;
        var el = this, $el = $(el), popr_class, attr_class = '', attr_mode, d_m;
        $('.popr_container').remove( );

        d_m = set.mode;
        if ( !!(attr_mode = $el.attr('data-popr-mode')) ) d_m = attr_mode;
        attr_class = $el.attr('data-popr-class');
        popr_class = 'popr_container popr_container_' + d_m + (!!set['class'] ? ' '+set['class'] : '') + (!!attr_class ? ' '+attr_class : '');

        var popr = $('<div class="'+popr_class+'"><div class="popr_content">' + $('#' + $el.attr(set.attribute)).html( ) + '</div></div>').appendTo('body');
        popr[0]._popr_target = el;
        
        popr_adjust( popr, el );
        
        if ( !global_handler_added )
        {
            $('body').on('mouseup.popr2 keyup.popr2', function popr_hide( evt ){
                // outside click or ESC key pressed
                var $el = $(evt.target);
                if ( ('keyup' === evt.type && 27 === evt.which) ||
                    ('mouseup' === evt.type && (($el.is('a,label,.popr-item') && $el.parent('.popr_content').length) || !$el.closest('.popr_container').length)) 
                )
                {
                    $('body').off('mouseup.popr2 keyup.popr2');
                    global_handler_added = false;
                    setTimeout(function( ) {
                        $('.popr_container').remove( );
                    }, 10);
                }
            });
            global_handler_added = true;
        }
        
        popr.addClass('popr_visible');
    });
    
    if ( !window_resize_added )
    {
        $(window).on('resize.popr2', function popr_resize( evt ){
            $('.popr_container').each(function( ){
                popr_adjust( $(this), this._popr_target );
            });
        });
        window_resize_added = true;
    }
};
}(jQuery);