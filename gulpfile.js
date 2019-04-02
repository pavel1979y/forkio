'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const del = require('del');
const wait = require('gulp-wait');
const cleanCSS = require('gulp-clean-css');



gulp.task('dev', function (){
    browserSync.init({
        server: "./dist/"
    });

    gulp.src('./src/index.html').pipe(gulp.dest('./dist/'));
    gulp.watch('./src/scss/*.scss',['sass'], {readDelay: 100}).on('change', browserSync.reload);
    gulp.watch('./src/index.html').on('change', function(){
        return gulp.src('./src/index.html').pipe(gulp.dest('./dist/'))
    });
    gulp.watch('./src/js/*.js',['minify']).on('change', browserSync.reload);
		gulp.watch('./dist/index.html').on('change', browserSync.reload)
		gulp.watch('./src/index.html').on('change', browserSync.reload)
});


gulp.task('sass', ['img'], function(){
	return gulp.src(
	[
	'./src/scss/reset-src.scss',
	'./src/libs/OwlCarousel2-2.3.4/dist/assets/owl.carousel.min.css',
	'./src/libs/OwlCarousel2-2.3.4/dist/assets/owl.theme.default.min.css',
	'./src/scss/style.scss']
	)
	.pipe(sourcemaps.init())
	.pipe(wait(1500))
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
	.pipe(sourcemaps.write())
	.pipe(cleanCSS())
	.pipe(concat('style.min.css'))
	.pipe(gulp.dest('./dist/css'))
})

gulp.task('img', function() {
    return gulp.src('./src/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('minify', function(){
	return gulp.src(
	[
		'./src/libs/jquery/dist/jquery.min.js',
		'./src/libs/OwlCarousel2-2.3.4/dist/owl.carousel.min.js',
		'./src/js/*.js'
	])
	.pipe(concat('common.min.js'))
	.pipe(minify())
	.pipe(gulp.dest('./dist/js'))
});


gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('build', ['clean', 'sass', 'minify'], function() {

	const buildFonts = gulp.src('./src/fonts/**/*')
		.pipe(gulp.dest('./dist/fonts'))
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['build'], function(){
    console.log('=== ALL DONE ===')
});