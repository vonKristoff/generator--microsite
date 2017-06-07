import axios from 'axios/dist/axios'

const speed = 200
const tablet = 768
const server = "https://jwt-server-phrlckomlp.now.sh/"
const api = "http://localhost:8080/"

export function srcToMobile(path) {
    let src = path.split('/')
    src.splice(src.length - 1 ,0 ,"_lowres")
    return src.join('/')
} 
export function wait(expression, next) {
    let timeout = setInterval(() => {
        console.log('tick')
        if(expression) {
            clearInterval(timeout)
            next(expression)
        }
    }, 50)
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
export function validateToken(callback) {
    return isValid(getURLParams("token"))
}

function getURLParams(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search)
    return results == null ? false : decodeURIComponent(results[1].replace(/\+/g, " "))
}
function isValid(token) {
    return axios.get(`${api}validate/${token}`)
}