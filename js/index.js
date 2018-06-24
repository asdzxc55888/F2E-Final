$(function(){
    var $item = $('.carousel .item'); 
    var $wHeight = $(window).height();
    $item.height($wHeight); 
    $item.addClass('full-screen');


    $('.carousel').carousel({
        interval: 4000,
        ride:true
      })
});