import Commonjs from 'rollup-plugin-commonjs'
import Resolve from 'rollup-plugin-node-resolve'
import html from 'rollup-plugin-html'
import Buble from 'rollup-plugin-buble'
import Uglify from 'rollup-plugin-uglify'
import eslint from 'rollup-plugin-eslint'
import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json'
import { minify } from 'uglify-js'

export default {
    entry: 'js/main.js',
    format: 'iife',
    dest: 'public/bundle.js',
    moduleName: `${process.env.npm_package_name}-wrapper`,
    sourceMap: (process.env.NODE_ENV != 'production'),
    plugins: [
        Resolve({
            jsnext: true,
            main: true
        }),        
        html({ include: 'js/templates/*.html' }),
        json({ include: '_scripts/*.json' }),
        Buble({
            transforms: {
                classes: true,
                arrow: true,
                modules: true,
                dangerousForOf: true
            },
            objectAssign: 'Object.assign',
            exclude: "./node_modules",
            file: 'public/bundle.js',
            source: 'js/main.js'
        }),        
        Commonjs({
            include: ['node_modules/**', 'views/**/config.js'],
        }),        
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        eslint(),
        (process.env.NODE_ENV === 'production' && Uglify({}, minify))
    ]
}
