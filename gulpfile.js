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
const fs = require('fs');

// File paths
const files = {
    html: 'src/templates/pages/**/*.njk',
    css: 'src/css/**/*.css',
    js: 'src/js/**/*.js'
};

// Define languages and pages
const languages = ['en', 'es'];
const pages = [
    { template: 'services.njk', filenames: { en: 'services.html', es: 'servicios.html' } },
    { template: 'index.njk', filenames: { en: 'index.html', es: 'inicio.html' } }
];

// Clean task: Delete the /dist folder if it exists
async function clean() {
    const { deleteAsync } = await import('del');  // Use the correct named export from 'del'
    return deleteAsync('dist');  // Delete the 'dist' folder using the `deleteAsync` method
}


// Tailwind CSS task (with sourcemaps for dev, without for build)
function cssTask(devMode) {
    return src(files.css)
        .pipe(devMode ? sourcemaps.init() : noop())
        .pipe(postcss([tailwindcss, autoprefixer, ...(devMode ? [] : [cssnano])]))
        .pipe(devMode ? sourcemaps.write('.') : noop())
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// Nunjucks HTML task (minify only in production)
function htmlTask(devMode) {
    const tasks = languages.map((lang) => {
        return pages.map((page) => {
            const commonTranslations = JSON.parse(fs.readFileSync(`src/lang/${lang}/common.json`, 'utf8'));
            const pageTranslationsFilePath = `src/lang/${lang}/${page.filenames[lang].split('.')[0]}.json`;

            if (fs.existsSync(pageTranslationsFilePath)) {
                const pageTranslations = JSON.parse(fs.readFileSync(pageTranslationsFilePath, 'utf8'));

                // Merge common and page-specific translations
                const translations = Object.assign({}, commonTranslations, pageTranslations);

                return src(`src/templates/pages/${page.template}`)
                    .pipe(nunjucksRender({
                        path: ['src/templates/'],
                        data: { translations }
                    }))
                    .pipe(devMode ? noop() : htmlmin({ collapseWhitespace: true }))
                    .pipe(dest(`dist/${lang}`))
                    .pipe(browserSync.stream());
            } else {
                console.error(`Translation file not found: ${pageTranslationsFilePath}`);
            }
        });
    });

    return Promise.all(tasks.flat());
}

// JavaScript task (with sourcemaps for dev, minify for production)
function jsTask(devMode) {
    return src(files.js)
        .pipe(devMode ? sourcemaps.init() : noop())
        .pipe(concat('main.js'))
        .pipe(devMode ? noop() : terser())
        .pipe(devMode ? sourcemaps.write('.') : noop())
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

// Development task (with async completion signal)
function dev(done) {
    series(
        clean, // Clean dist folder before dev
        parallel(() => htmlTask(true), () => cssTask(true), () => jsTask(true)),
        watchTask
    )();
    done(); // Signal async completion
}

// Build task for production
function build(done) {
    series(
        clean,  // Add clean task before the build
        parallel(() => htmlTask(false), () => cssTask(false), () => jsTask(false))
    )();
    done(); // Signal async completion
}

// No-op function for production (to skip sourcemaps and unnecessary steps)
function noop() {
    return require('through2').obj();
}

exports.dev = dev;
exports.build = build;
exports.clean = clean;
