import rtio from './includes/rtio' // aspect ratio coordinate translator for responsive video
import keyframes from './includes/keyframes'
import ios from 'is-ios'
import attachFastClick from 'fastclick'
import config from '../_scripts/config.root.json'

import VideoInstance from './video-player.js'

var cache = {}
const _tablet = 768
let speed = 150 // throttle amount

let state = {
    burgerblack: false,
    mobile: false,
    player: false,
    sidescroller: false,
    homepage: false,
    vimeoplaying: false,
    iosplaying: false
}
let video = {
    interval: null,
    frame: null,
    width: 1920,
    height: 1080,
    ratio: 1920/1080,
    landscape: null
}
/**
 * Attach main script and run
 */
function mount() {
    var video = new VideoInstance(".video-container--")
    console.log(video.type)
    cache.$navBurger = document.querySelector(".hamburger") // nav
    cache.$navIcon = document.querySelector(".menu--icon") // nav
    cache.$navMobile = document.querySelector("nav[role='mobile']") // nav
    cache.$body = document.querySelector("body") // nav

    cache.$hero = document.querySelector(".hero-container") // hero
    cache.$herotext = document.querySelector(".hero-container .body") // hero
    cache.$all_works = document.querySelector(".hero-container .link-item") // all works button

    cache.$collection = document.querySelectorAll('[data-bg]') // image background collection
    
    // cache.$player = document.getElementById("player") // standard video player
    cache.$loading = document.querySelector(".loading") // loading spinner
    cache.$hud = document.querySelector(".target-layer") // video keyframe container
    cache.$vimeo = document.querySelector("iframe") // vimeo video player

    cache.$submit = document.querySelector("#submit") // mailchimp
    cache.$form = document.querySelector(".mailchimp-signup") // mailchimp
    cache.$input = document.querySelector("#mce-EMAIL") // mailchimp

    state.mobile = (window.innerWidth < _tablet)
    video.setViewport(state.mobile)
    // if(cache.$player) setupHtml5Video()
    // if(cache.$vimeo != null) wait(Vimeo, setupVimeo)

    let nodelist = [].slice.call(cache.$collection)
    nodelist.forEach(setBackgrounds)

    attachFastClick(document.body)
    // handleSignupFocus()
    // setNavToggles()    
    scrollHandler()
    // onResize()
    if(state.homepage) setupHomeTouch()
    window.addEventListener("scroll", throttle(scrollHandler))
    // window.addEventListener("resize", onResize)
}


/**
 * Helper methods ..
 */


function scrollHandler() {

    let percentVisible = (state.mobile) ? 1 : isVisible(cache.$hero.getBoundingClientRect())

    video.handleScroll(percentVisible)
    
    // if(cache.$hero) {
    //     // let pct = (state.mobile) ? 1 : isVisible(cache.$hero.getBoundingClientRect())
    //     let pct = isVisible(cache.$hero.getBoundingClientRect())
    //     if(!cache.$player && !state.mobile) cache.$herotext.style.opacity = Math.pow(pct, 8)
    //     if(!state.burgerblack && pct == 0) toggleBurgerBlack(true)
    //     if(state.burgerblack && pct > 0) toggleBurgerBlack(false)
    // }
}
function toggleBurgerBlack(bool) {
    let stop = (cache.$body.classList.contains("state--menu")) ? true : bool
    state.burgerblack = bool
    cache.$navIcon.classList.toggle("dark")
    if(cache.$player) stopPlayback(stop)
    if(cache.$all_works) cache.$all_works.classList.toggle("is-dark")
    if(cache.$vimeo) pauseVimeoPlayback(bool)
    // if(cache.$projects) cache.$projects.classList.toggle("dark")
}
function stopPlayback(bool) {
    if(!ios) {
        if(bool) {
            cache.$player.pause()
            clearInterval(video.interval)
        } else if(!state.mobile) {
            cache.$player.play()
            video.interval = setInterval(() => {
                if(cache.$player.currentTime > 0 && cache.$loading.classList.contains('is-active')) removeSpinner()
                videoInterval()
            }, 300)        
        }
    } else {
        iosVideoPause()
    }
}
function isVisible($el) {
    let innerHeight = (state.homepage) ? window.innerHeight : window.innerHeight * .5
    return ($el.top <= 0 && $el.bottom > window.pageYOffset - innerHeight) ? $el.bottom / innerHeight : 0
}
// switch out img tags CSS backgound images && enable touch over for mobile
function setBackgrounds($el) {
    let src = $el.getAttribute('data-bg')
    if(state.mobile) {
        src = srcToMobile(src)
        $el.childNodes[0].addEventListener('touchstart', touchToggle)
    } 
    $el.style.backgroundImage = `url(${src})`
    if(src.includes("--hero") && $el.classList.contains("hero-container") && !state.mobile && cache.$vimeo != null) $el.style.backgroundImage = "none"
}
// switch image source to mobile version
function srcToMobile(path) {
    let src = path.split('/')
    src.splice(src.length - 1 ,0 ,"_lowres")
    return src.join('/')
}
function onResize() {    
    state.mobile = (window.innerWidth < _tablet)
    if(cache.$player) { 
        if(window.pageYOffset - window.innerHeight < 0 || state.mobile) stopPlayback(state.mobile)
    }
    video.setViewport(state.mobile)
}
function touchToggle() {
    this.classList.toggle('touchover')
}
// add homepage labels to accompany video
function assignLabels(meta) {

    let t1 = cache.$keyframe.children[0].children[0],
        t2 = cache.$keyframe.children[0].children[1]

    t1.innerHTML = (meta.data) ? `${meta.data.h} `: ""
    t2.innerHTML = (meta.data) ? meta.data.p : ""

    if(meta.leave) cache.$keyframe.classList.add('leave')
    else if(cache.$keyframe.classList.contains('leave')) cache.$keyframe.classList.remove('leave')
    
    if(meta.enter) cache.$keyframe.classList.add('enter')
    else if(cache.$keyframe.classList.contains('enter')) cache.$keyframe.classList.remove('enter')

}
function setNavToggles(){
    // toggle nav menu
    cache.$navBurger.addEventListener("click", () => {
        cache.$body.classList.toggle("state--menu")
        cache.$navBurger.classList.toggle("is-active")
        if(cache.$player && !ios) stopPlayback(cache.$body.classList.contains("state--menu"))
        if(cache.$vimeo) pauseVimeoPlayback(true)
        if(ios) iosVideoPause()
    }, false)

    if(cache.$hero) {
        state.homepage = (cache.$hero.classList.contains('home'))
        if(ios) cache.$hero.style.backgroundAttachment = "scroll" // ios hack to stop hero crapout
    } else {
        toggleBurgerBlack(true)
    }
}
function setupHomeTouch() {
    cache.$selectedProjects = document.querySelectorAll(".selected-projects li")
    let nodes = [].slice.call(cache.$selectedProjects)
    nodes.forEach($el => {
        $el.childNodes[0].addEventListener('touchstart', touchToggle)
    })  
}
function handleSignupFocus() {
     // email submit handler for mobile
    cache.$input.onfocus = function() {
        if(window.innerWidth < 640) {
            cache.$navMobile.classList.add('signup')
        }        
    }
    cache.$input.onblur = function() {
        if(window.innerWidth < 640) {
            cache.$navMobile.classList.remove('signup')
        }        
    }
    // close nav menu on mailchimp submit
    cache.$input.addEventListener("submit", (e) => {
        cache.$body.classList.remove('state--menu')
    })
}
/**
 * Standard HTML5 Video
 */
function setupHtml5Video() {
    let vsrc = config.home.body.video, // standard video
        hsrc = vsrc.split("/") // hires video
    hsrc.splice(hsrc.length - 1, 0, "_hires")
    let source = cache.$player.getElementsByTagName('source')
    cache.$player.setAttribute('src', (window.innerWidth > 1440) ? hsrc.join("/") : vsrc)
    cache.$player.load()
    cache.$player.addEventListener('canplay', e => {
        removeSpinner()
        if(cache.$player.classList.contains("is-disabled")) cache.$player.classList.remove("is-disabled")
    })
    cache.$player.volume = 0
    cache.$keyframe = document.querySelector('.keyframe')
    if(state.mobile) removeSpinner()
    // hande ios crap
    if(ios) {
        removeSpinner()
        if(cache.$player.classList.contains("is-disabled")) cache.$player.classList.remove("is-disabled")
        state.iosplaying = false 
        cache.$play = document.querySelector(".ios-play")
        cache.$play.classList.add('has-ios')
        cache.$play.addEventListener("click", function() {
            if(state.iosplaying) {
                iosVideoPause()
            } else {
                cache.$player.play()
                state.iosplaying = true
                video.interval = setInterval(() => {
                    videoInterval()
                }, 300)  
            }
            cache.$play.classList.add("is-active")
        })
    }
}
function videoInterval() {
    video.frame = Math.round(cache.$player.currentTime * 25)
    let key = keyframes.evaluate(video.frame)
    if(key.arr.length > 0) rtio.event(cache.$hud, cache.$keyframe, key.data)
    assignLabels(key)
}
function removeSpinner() {    
    cache.$loading.classList.remove('is-active')
    cache.$loading.classList.remove('fa-spin')
}
function iosVideoPause() {
    clearInterval(video.interval)
    cache.$player.pause()
    state.iosplaying = false
    cache.$play.classList.remove("is-active")
}
function wait(test, next) {
    let temp = setInterval(() => {
        if(test) {
            clearInterval(temp)
            next()
        }
    }, 100)
}
/**
 * using Vimeo API
 */
function setupVimeo() {
    removeSpinner()    
    cache.$vimeo.classList.remove('is-disabled')
    cache.$vimeoplayer = new Vimeo.Player(cache.$vimeo)
    let $vp = cache.$vimeoplayer
    $vp.on('error', function(e) {
        cache.$vimeo.classList.add('is-disabled')
    })
    $vp.on('play', function() {
        state.vimeoplaying = true
        toggleHeroText()
    })
    $vp.on('ended', function() {
        state.vimeoplaying = false
        toggleHeroText()
    })
    $vp.on('pause', function() {
        state.vimeoplaying = false
        toggleHeroText()
    })
}
function toggleHeroText() {
    cache.$herotext.classList.toggle("is-hidden")   
}
function pauseVimeoPlayback(hide) {
    // toggle vimeo playback if playing
    if(hide && state.vimeoplaying) cache.$vimeoplayer.pause()
}

// generic throttle
function throttle(next) {    
    let start = Date.now()
    return function() {
        if(Date.now()) {
            start = Date.now() // reset
            next()       
        }
    }
}

window.onload = function() {
    mount()
}