import ios from 'is-ios'
/**
 * Constuctor PASS a 'container class | id'
 * it will look for child element 2 either a <video> || <iframe> and set up respectively
 */
export default class {
    constructor(target) {        
        this.element = document.querySelector(target)
        this.player = null
        this.videoElement = null
        
        this.type = (this.element) ? setVideoType.call(this, this.element) : false
        this.loader = (this.type) ? document.querySelector(".loading") : false
        this.callbacks = {}
        this.state = {
            playing: (this.type == "video" && !ios) ? true : false,
            mobile: false
        }

        if(ios) this.touchButton = null
        if(this.element) init.call(this)
    }
    // extend private player events
    addEvent(name, fn) {
        this.callbacks[name] = fn
    }  
    handleScroll(percentVisible) {
        if(this.element) {
            if(percentVisible > 0) actions.playOnScroll.call(this, true)
            else actions.playOnScroll.call(this, false)
        } 
    }
    setViewport(isMobile, scrollTop) {
        this.state.mobile = isMobile
        if(this.element && isMobile) this.stop()
        if(!isMobile) this.handleScroll(scrollTop)
    }
    play() {
        if(!this.state.mobile) {
            if(this.type == "video") {
                this.state.playing = true
                this.player.play()
            } 
            // if(this.type == "vimeo") console.log('vimeo play')
        }
    }
    stop() {
        if(this.element) {
            this.state.playing = false
            this.player.pause()
        }
    }
}
/**
 * Actions
 */
const actions = {
    playOnScroll(play) {
        if(this.state.playing) {
            if(!play) this.stop()
        } else {
            if(play) this.play()
        }
    },
    removeSpinner() {    
        this.loader.classList.remove('is-active')
        this.loader.classList.remove('fa-spin')
    }
}
/**
 * Private Methods
 */
function init() {
    switch (this.type) {
        case "vimeo":
            let vimeo = new Vimeo.Player(this.videoElement)            
            vimeo.ready().then(() => {
                this.player = vimeo                
                actions.removeSpinner.call(this)
                if(this.videoElement.classList.contains("is-disabled")) this.videoElement.classList.remove('is-disabled')
            })
            vimeo.on('play', () => {
                this.state.playing = true
                if(this.callbacks['vimeo-toggle']) this.callbacks['vimeo-toggle']()
            })
            vimeo.on('pause', () => {
                this.state.playing = false
                if(this.callbacks['vimeo-toggle']) this.callbacks['vimeo-toggle']()
            })
            break
        case "video":
            this.player = this.videoElement
            this.player.volume = .5
            if(ios) setupIOS.call(this)
            this.player.addEventListener('canplay', e => {
                actions.removeSpinner.call(this)
                if(this.player.classList.contains("is-disabled")) this.player.classList.remove("is-disabled")
            })
        break
    }
}

function setVideoType(el) {
    this.videoElement = el.childNodes[1]
    return (el.childNodes[1].nodeName == "VIDEO") ? "video" : "vimeo"
}
function setupIOS() {
    this.touchButton = document.querySelector(".ios-play")
    this.touchButton.classList.add('has-ios')
    this.touchButton.addEventListener("click", function() {
        if(this.state.playing) {
            this.stop()
            this.touchButton.classList.add("is-active")
        } else {
            this.play()
            this.touchButton.classList.remove("is-active")
        }                 
    })
}