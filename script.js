//______________________________DATA__________________________________________________________________________________________________
var dur = 7000; 
var sc = 0; 
var gameInProgress = false;

//______________________________SCORE + TIMER_________________________________________________________________________________________
// Mouseover function uses Jquery

$(document).ready(function () { 
    $('#jeanmichel').bind('mouseenter', function () {
        var self = $(this);
        this.iid = setInterval(function () {
            scoreAlert();
            scoring();
        }, 20);
    }).bind('mouseleave', function () {
        this.iid && clearInterval(this.iid);
    });

});

function scoring() {
    if (gameInProgress == true) {
        document.getElementById("top").innerHTML = Math.ceil(sc += 1000);
    }
}

//______________________________SYSTEM________________________________________________________________________________________________

function start() {
    if (gameInProgress == false) {
        scoreReset(), letAnimate(), finalScore(), okLetzGo();
    }
}

function scoreReset() {
    sc = 0;
    document.getElementById("top").innerHTML = Math.ceil(sc);
}

function finalScore() {
    gameInProgress = true; //Define if a fame is goin on, true = 1
    var delayInMilliseconds = dur * 2; //*2 animejs is alternate
    setTimeout(function () {
        gameInProgress = false;
        gta.play();
        alert('Your final score is ' + sc);
    }, delayInMilliseconds);
}

function reset() {
    gameInProgress = false;
    animation.pause();
}

function clickable() {
    document.getElementById("bouton1")
}

//______________________________SOUND_________________________________________________________________________________________________

var letzGo = new Audio('public/audio/letzgo.mp3');
var woo = new Audio('public/audio/woo.mp3');
var hii = new Audio('public/audio/hii.mp3');
var gama = new Audio('public/audio/gama.mp3');
var legati = new Audio('public/audio/legati.mp3');
var drr = new Audio('public/audio/drr.mp3');
var hit = new Audio('public/audio/hit.mp3');
var loop = new Audio('public/audio/loop.mp3');
var gta = new Audio('public/audio/gta.mp3');

function okLetzGo() {
    letzGo.play();
    loop.play();
}

function scoreAlert() {
    if (gameInProgress == true) {
        switch (sc) {
            case 50000:
                woo.play();
                break;
            case 100000:
                hii.play();
                break;
            case 150000:
                woo.play();
                break;
            case 200000:
                legati.play();
                break;
            case 250000:
                woo.play();
                break;
            case 300000:
                drr.play();
                break;
            case 350000:
                woo.play();
                break;
            default:
                hit.play();
                break;
        }
    }
}

//______________________________ANIMATION______________________________________________________________________________________________

function letAnimate() {

    const maxX = 1100, maxY = -450; // Animation area

    let animation = anime({
        targets: '#jeanmichel',
        // Properties 
        keyframes: [
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
            { translateY: Math.floor((Math.random() * maxY) + 1), translateX: Math.floor((Math.random() * maxX) + 1) },
        ],
        // Property Parameters
        duration: dur,
        easing: 'easeInOutSine',
        // Animation Parameters
        direction: 'alternate'
    });

}