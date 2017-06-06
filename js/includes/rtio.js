export default {
    w: 1920,
    h: 1080,
    aspect: .5625,
    byHeight() {
        // where are we scaling the max from
        return (window.innerWidth > window.innerHeight && this.aspect > (window.innerHeight / window.innerWidth))
    },
    event($container, $keyframe, key) {
        // runtime set inline styles
        if(this.byHeight()) {
            let transform = this.getTransform(key, this.transformByHeight())
            $container.style.width = `${window.innerHeight / this.aspect}px`
            $container.style.height = `${window.innerHeight}px`
            $keyframe.style.transform = `translate(${transform.x}px,${transform.y}px)`
        } else {
            let transform = this.getTransform(key, this.transformByWidth())
            $container.style.width = "100%"
            $container.style.height = `${window.innerWidth * this.aspect}px`
            $keyframe.style.transform = `translate(${transform.x}px,${transform.y}px)`
        }
    },
    transformByWidth() {
        let w = window.innerWidth,
            h = w * this.aspect
        return {w, h}
    },
    transformByHeight() {
        let h = window.innerHeight,
            w = h / this.aspect
        return {w, h}
    },
    getTransform(key, box) {
        let ratioW = box.w / this.w,
            ratioH = box.h / this.h
        return {x: key.x * ratioW, y: key.y * ratioH }
    }
}