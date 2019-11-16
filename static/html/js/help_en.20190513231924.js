(function(d){var h=[];d.loadImages=function(a,e){"string"==typeof a&&(a=[a]);for(var f=a.length,g=0,b=0;b<f;b++){var c=document.createElement("img");c.onload=function(){g++;g==f&&d.isFunction(e)&&e()};c.src=a[b];h.push(c)}}})(window.jQuery);
$.fn.hasAttr = function(name) { var attr = $(this).attr(name); return typeof attr !== typeof undefined && attr !== false; };


$(document).ready(function() {
r=function(){dpi=window.devicePixelRatio;$('.js-5').attr('src', (dpi>1) ? 'images/1-en-1826.png' : 'images/1-en-913.png');
$('.js-6').attr('src', (dpi>1) ? 'images/2-en-1846.png' : 'images/2-en-923.png');
var a='data-src'; if($('.js-7 .slide0').hasAttr('src')) { a='src'; } $('.js-7 .slide0').attr(a, (dpi>1) ? 'images/3-1-en-1840.png' : 'images/3-1-en-920.png');
var a='data-src'; if($('.js-7 .slide1').hasAttr('src')) { a='src'; } $('.js-7 .slide1').attr(a, (dpi>1) ? 'images/3-2-en-1840.png' : 'images/3-2-en-920.png');
$('.js-8').attr('src', (dpi>1) ? 'images/4-en-1846.png' : 'images/4-en-923.png');};
if(!window.HTMLPictureElement){r();}
(function(){$('a[href^="#"]:not(.allowConsent,.noConsent,.denyConsent,.removeConsent)').each(function(){$(this).click(function(){var t=this.hash.length>1?$('[name="'+this.hash.slice(1)+'"]').offset().top:0;return $("html, body").animate({scrollTop:t},400),!1})})})();
$('.js-7 .slider').slick({lazyLoad: 'ondemand',slidesToShow: 1,slidesToScroll: 1,fade: true,slide: 'div',cssEase: 'linear',speed: 300,dots: false,arrows: false,infinite: true,autoplay: true,pauseOnHover: false,autoplaySpeed: 2500});
});