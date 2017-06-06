const speed = 200
const tablet = 768

export function srcToMobile(path) {
    let src = path.split('/')
    src.splice(src.length - 1 ,0 ,"_lowres")
    return src.join('/')
} 
export function wait(expression, next) {
    let timeout = setInterval(() => {
        if(expression) {
            clearInterval(timeout)
            next()
        }
    }, 100)
}
export function throttle(next) {    
    let start = Date.now()
    return function() {
       if(Date.now() - start > speed) {
            start = Date.now()
            next()       
        }
    }
}
export function isMobile() {
    return (window.innerWidth < tablet)
}