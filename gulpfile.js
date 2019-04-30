const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const sourceMaps = require('gulp-sourcemaps');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const run = require('run-sequence');
const del = require('del');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

gulp.task('sass',function(){
    return gulp.src('scss/style.scss')
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 version']
    }))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('biuld/css'))
    .pipe(browserSync.reload({strim: true}));
});

gulp.task('html',function(){
    return gulp.src('*.html')
    .pipe(gulp.dest('biuld'))
    .pipe(browserSync.reload({strim: true}));
});

gulp.task('js',function(){
    return gulp.src('js/**/*.js')
    .pipe(gulp.dest('biuld/js'))
    .pipe(browserSync.reload({strim: true}));
});

gulp.task('css',function(){
    return gulp.src('css/**/*.css')
    .pipe(gulp.dest('biuld/css'))
    .pipe(browserSync.reload({strim: true}));
});

gulp.task('allimg',function(){
    return gulp.src('img/**/*.{png,jpg}')
    .pipe(gulp.dest('biuld/img'))
    .pipe(browserSync.reload({strim: true}));
});