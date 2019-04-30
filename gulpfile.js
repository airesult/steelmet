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

gulp.task('images',function(){
    return gulp.src('build/img/**/*.{png,jpg}')
    .pipe(imagemin([
        imagemin.jpegtran({progressive: true}),
        imageminJpegRecompress({
            loops: 5,
            min: 65,
            max: 70,
            quality: 'medium'
        }),
        imagemin.optipng({optimizationLevel: 3}),
        pngquant({quality: '65-70', speed: 5})
    ]))
    .pipe(gulp.dest('biuld/img'));
});

gulp.task('svg',function(){
    return gulp.src('build/img/**/*.svg')
    .pipe(svgmin({
        js2svg: {
            pretty: true
        }
    }))
    .pipe(cheerio({
        run: function ($) {
            $('[fill]').removeAttr('fill');
            $('[stroke]').removeAttr('stroke');
            $('[style]').removeAttr('style');
        },
        parserOptions: {xmlMode: true}
    }))
    .pipe(replace('&gt;', '>'))
    // build svg sprite
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: "sprite.svg"
            }
        }
    }))
    .pipe(gulp.dest('build/img'));
});

gulp.task('serve',function(){
    browserSync.init({
        server: "build"
    });
    gulp.watch("scss/**/*.scss", ["sass"]);
    gulp.watch("*.html", ["html"]);
    gulp.watch("js/**/*.js", ["js"]);
    gulp.watch("img/**/*.{png,jpg}", ["allimg"]);
    gulp.watch("img/**/*.{svg}", ["svg"]);
});

gulp.task('copy',function(){
    return gulp.src([
        'img/**',
        'js/**',
        'css/**',
        '*.html'

    ], {
        base: '.'
    })
    .pipe(gulp.dest('build'));
});

gulp.task('clean',function(){
    return del('build');
});

gulp.task('build',function(fn){
    run(
        'clean',
        'copy',
        'sass',
        'images',
        'svg',
        fn
    );
});