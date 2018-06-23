$(function(){
    var $item = $('.carousel .item'); 
    var $wHeight = $(window).height();
    $item.height($wHeight); 
    $item.addClass('full-screen');

    $('.carousel img').each(function() {
      var $src = $(this).attr('src');
      var $color = $(this).attr('data-color');
      $(this).parent().css({
        'background-image' : 'url(' + $src + ')',
        'background-color' : $color
      });
      $(this).remove();
    });
    $('.carousel').carousel({
        interval: 3000,
        ride:true
      }) 
});