/**
 **
 ** YOUTUBE API iframe embed
 **
 **/

// Loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Creates an <iframe> (and YouTube player)
// after the API code downloads.
var youtubePlayer;
function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtubePlayer', {
        height: '100%',
        width: '100%',
        playerVars: { 'controls': 0, 'rel': 0, 'showinfo': 0, 'modestbranding': 1, 'info': 0 },
        events: {
            'onReady': runSlider
        }
    });
}


/**
 **
 ** VIMEO API iframe embed
 **
 **/

function playVimeoVideo(videoUrl){
    // This is the oEmbed endpoint for Vimeo (we're using JSON)
    // (Vimeo also supports oEmbed discovery. See the PHP example.)
    var endpoint = 'http://www.vimeo.com/api/oembed.json';
    // Tell Vimeo what function to call
    var callback = 'embedVimeoVideo';
    // Put together the URL
    var url = endpoint + '?url=' + encodeURIComponent(videoUrl) + '&callback=' + callback + '&width='+window.innerWidth + '&byline=false' + '&autoplay=true';

    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', url);
    document.getElementsByTagName('head').item(0).appendChild(js);
}

// This function puts the video on the page
function embedVimeoVideo(video) {
    document.getElementById('vimeoPlayer').innerHTML = unescape(video.html);
}

/**
 **
 ** This functions gives us the width off the vertical scroolbar if exists
 **
 **/

/*function getScrollBarWidth(){
    // Create hidden div (outer) with width set to '100px' 
    // and get offset width (should be 100) 
    // Force scroll bars to appear in div (outer) 
    // using CSS overflow property 
    // Create new div (inner) and append to outer, set its 
    // width to '100%' and get offset width Calculate 
    // scrollbar width based on gathered offsets Working example
    var outer = document.createElement("div"); 
    outer.style.visibility = "hidden"; 
    outer.style.width = "100px"; 
    outer.style.msOverflowStyle = "scrollbar";
    document.body.appendChild(outer);
    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";
    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);        
    var widthWithScroll = inner.offsetWidth;
    // remove divs
    outer.parentNode.removeChild(outer);

    return (widthNoScroll - widthWithScroll);
}*/


//Run slider and video functionalities
function runSlider(){
    
    $(document).ready(function() {

        //carousel init
        var sliderContainer = $('.sliderx');
        sliderContainer.removeClass('hide-slider');
        
        var slider = $(".carousel-featured-slider .slider").slick({
            dots: true,
            infinite: true,
            centerMode: false,
            autoplay: true,
            autoplaySpeed: 1800000,
            pauseOnHover: false,    
            centerPadding: '0px',
            slidesToShow: 1,
            variableWidth: false,
            prevArrow: $('.carousel-featured-slider .left-edge'),
            nextArrow: $('.carousel-featured-slider .right-edge'),
        });

        //video init
        var youtubeVideoContainer = $('#youtube-video-container');
        var youtubeCloseVideo = youtubeVideoContainer.find('.close-video');

        var vimeoVideoContainer = $('#vimeo-video-container');
        var vimeoCloseVideo = vimeoVideoContainer.find('.close-video');

            
        //open video
        $('.video__placeholder, .video__button').each(function(){
            $(this).click(function() {
                var videoUrl = $(this).parent().find('img').attr('data-video');

                if (videoUrl.indexOf('youtube') !== -1) {
                    //YOUTUBE
                    var videoId = videoUrl.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                    var videoContainerHeight = (window.innerWidth * (9/16))/* - getScrollBarWidth()*/;
                    
                    youtubeVideoContainer.css('height',videoContainerHeight+'px');
                    youtubeVideoContainer.show();
                    sliderContainer.addClass('hide-slider');
                    
                    youtubePlayer.loadVideoById({
                        'videoId': videoId[2],
                    });
                    
                    youtubePlayer.playVideo();                    
                } 
                else if (videoUrl.indexOf('vimeo') !== -1) {
                    //VIMEO
                    vimeoVideoContainer.show();
                    sliderContainer.addClass('hide-slider');

                    playVimeoVideo(videoUrl);
                } 
                else {
                    console.log('invalid video url');
                    return false;
                }      

            }); //end click
        }); //end each

        //close video
        youtubeCloseVideo.click(function(){
            youtubePlayer.stopVideo();
            youtubeVideoContainer.hide();
            sliderContainer.removeClass('hide-slider');
        });
        vimeoCloseVideo.click(function(){
            vimeoVideoContainer.find('iframe').attr('src','');
            vimeoVideoContainer.hide();
            sliderContainer.removeClass('hide-slider');
        });

    });//end document ready
}
