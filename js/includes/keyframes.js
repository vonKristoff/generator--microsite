import frames from './frames'
export default {
    current: 0,
    prev: -1,
    status: {
        enter: false, 
        leave: false,
        data: null,
        arr: []
    },
    anim: false,
    evaluate(frame) {
        this.status.arr = this.frames.filter(item => {
            return frame > item.i && frame < item.o
        })
        if(this.status.arr.length > 0) {
            this.status.data = this.status.arr[0].data
            this.status.enter = true
        } else {            
            if(this.status.enter && !this.anim) this.exit(() => {
                this.status.data = null
                this.status.enter = false
                this.status.leave = false
            })
        }
        return this.status
    },
    exit(cb) {
        this.anim = true
        this.status.leave = true
        setTimeout(() => {
            this.anim = false            
            cb()
        }, 1000)
    },
    frames:frames
}