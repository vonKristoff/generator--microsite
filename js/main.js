import rtio from './includes/rtio' // aspect ratio coordinate translator for responsive video
import keyframes from './includes/keyframes'
import ios from 'is-ios'
import attachFastClick from 'fastclick'
import config from '../_scripts/config.root.json'
import {throttle, wait, isMobile} from './includes/helpers.js'
import VideoInstance from './includes/video-player.js'

var cache = {}
let state = {
    hero: false,
    mobile: false
}

function mount() {
    cache.video = new VideoInstance(".video-container")

    cache.$navBurger = document.querySelector(".hamburger") // nav
    cache.$navIcon = document.querySelector(".menu--icon") // nav
    cache.$navMobile = document.querySelector("nav[role='mobile']") // nav
    cache.$body = document.querySelector("body") // nav

    cache.$hero = document.querySelector(".hero-container") // hero
    cache.$herotext = document.querySelector(".hero-container .body") // hero  

    state.mobile = isMobile()
    state.hero = (cache.$hero)

    cache.video.setViewport(state.mobile, percentHeroVisible())
    cache.video.addEvent('vimeo-toggle', setVimeoToggle())

    setNavToggles()

    if(state.hero && ios) cache.$hero.style.backgroundAttachment = "scroll" // ios hack to stop hero crapout
    if(!state.hero) toggleNavColoursWhite(false)
    
    window.addEventListener("scroll", throttle(scrollHandler))
    window.addEventListener("resize", throttle(onResize))
}

function percentHeroVisible() {
    return (state.mobile) ? 1 : isVisible(cache.$hero.getBoundingClientRect())
}
function setNavToggles(){
    // toggle nav menu
    cache.$navBurger.addEventListener("click", () => {
        cache.$body.classList.toggle("state--menu")
        cache.$navBurger.classList.toggle("is-active")
        cache.video.stop()
    }, false)
}
function scrollHandler() {
    if(cache.$hero) {
        cache.video.handleScroll(percentHeroVisible())
        handleNavOnScroll(percentHeroVisible())        
    }
}
function handleNavOnScroll(percentVisible) {
    // inverse nav colours / trigger sticky headers
    if(percentVisible > 0) toggleNavColoursWhite(true)
    else toggleNavColoursWhite(false)
}
function toggleNavColoursWhite(state) {
    if(state) {
        // toggle to white
        if(cache.$navIcon.classList.contains("dark")) cache.$navIcon.classList.remove("dark")
    } else {
        // toggle to dark
        if(!cache.$navIcon.classList.contains("dark")) cache.$navIcon.classList.add("dark")
    }
}
function onResize() {  
    state.mobile = isMobile()
    cache.video.setViewport(state.mobile, percentHeroVisible())
}
function isVisible(bounds) {
    let heroHeight = window.innerHeight
    return (bounds.top <= 0 && bounds.bottom > window.pageYOffset - heroHeight) ? bounds.bottom / heroHeight : 0
}
function toggleHeroText() {
    cache.$herotext.classList.toggle("is-hidden")   
}
function setVimeoToggle() {
    // push to video-instance
    return function () {
        toggleHeroText()
    }
}

window.onload = function() {
    mount()
}