const { src, dest, watch, series, parallel } = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const tailwindcss = require('tailwindcss');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');

// File paths
const files = {
    html: 'src/templates/pages/**/*.njk',
    css: 'src/css/**/*.css',
    js: 'src/js/**/*.js'
};

// Tailwind CSS task (with sourcemaps for dev, without for build)
function cssTask(devMode) {
    return src(files.css)
        .pipe(devMode ? sourcemaps.init() : noop())  // noop() is a Gulp utility that does nothing if in production mode
        .pipe(postcss([tailwindcss, autoprefixer, ...(devMode ? [] : [cssnano])]))
        .pipe(devMode ? sourcemaps.write('.') : noop())  // write sourcemaps only in dev mode
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// Nunjucks HTML task (minify only in production)
function htmlTask(devMode) {
    return src(files.html)
        .pipe(nunjucksRender({
            path: ['src/templates/'] // Where the templates are located
        }))
        .pipe(devMode ? noop() : htmlmin({ collapseWhitespace: true }))  // minify HTML only in production mode
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

// JavaScript task (with sourcemaps for dev, minify for production)
function jsTask(devMode) {
    return src(files.js)
        .pipe(devMode ? sourcemaps.init() : noop())  // init sourcemaps only in dev mode
        .pipe(concat('main.js'))
        .pipe(devMode ? noop() : terser())  // minify JS only in production
        .pipe(devMode ? sourcemaps.write('.') : noop())  // write sourcemaps only in dev mode
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

// Watch files during development
function watchTask() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
    watch([files.html], () => htmlTask(true));
    watch([files.css], () => cssTask(true));
    watch([files.js], () => jsTask(true));
}

// No-op function for production (to skip sourcemaps and unnecessary steps)
function noop() {
    return require('through2').obj();
}

// Development task
function dev(done) {
    return series(
        parallel(() => htmlTask(true), () => cssTask(true), () => jsTask(true)),
        watchTask
    )(done);  // Signal async completion
}

// Build task for production
function build(done) {
    return series(
        parallel(() => htmlTask(false), () => cssTask(false), () => jsTask(false))
    )(done);  // Signal async completion
}


exports.dev = dev;
exports.build = build;
