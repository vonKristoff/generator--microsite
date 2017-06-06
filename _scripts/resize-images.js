const glob = require('glob-all')
const sharp = require('sharp')

let target = (process.env.NODE_ENV == 'production') ? 'dist' : 'public',
    type = process.argv[2]

const width = (type == "mobile") ? 640 : 1180
const ratio = .56
const maxWidth = 2560

let collate = function() {
    console.log(`++++++++++++++++++++++++++++++++ Processing Image Resizing - ${type} +++++++++++++++++++++++++++++++++`)
    return new Promise((resolve, reject) => {
        glob([
            `_images/**/*.jpg` // include 
            ], (err, files) => {
            let filtered = files.filter(f => {
                return !f.includes('_lowres')
            })
            if(!err) resolve(filtered)
            else reject(err)
        })
    })
}
collate().then(files => {
    files.forEach(path => {
        let output = (type == "mobile") ? mobileOutputPath(rewriteDestination(path)) : desktopOutputPath(rewriteDestination(path))
        let portrait = (type == "mobile" && output.includes("--hero"))
        width = (!portrait) ? width : maxWidth
        sharp(path)
            .resize((portrait) ? ~~(width / ratio) : width)
            .toFile(output, function(err, result) {
                if(err) console.log(err)
            })
    })
})

function rewriteDestination(path) {
    let pathAsArray = path.split('/')
    pathAsArray[0] = 'images'
    pathAsArray.unshift(target)
    return pathAsArray
}

function desktopOutputPath(ary) {
    return ary.join('/')
}
function mobileOutputPath(ary) {
    let file = '' + ary.pop()
    ary.splice(ary.length, 0, '_lowres') 
    ary.splice(ary.length, 0, file)
    return ary.join('/')
}