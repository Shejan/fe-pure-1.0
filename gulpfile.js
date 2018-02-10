var postcss = require('gulp-postcss');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat');
var cssnano = require('cssnano');
var rename = require('gulp-rename');
var autoprefixer = require('autoprefixer');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var wait = require('gulp-wait');
var imagemin = require('gulp-imagemin');
var imagePngquant = require('imagemin-pngquant');
var imageRecompress = require('imagemin-jpeg-recompress');
var alias = require('postcss-alias');
var crip = require('postcss-crip');
var magician = require('postcss-font-magician');
var triangle = require('postcss-triangle');
var circle = require('postcss-circle');
var linkColors = require('postcss-all-link-colors');
var center = require('postcss-center');
var clearfix = require('postcss-clearfix');
var position = require('postcss-position');
var size = require('postcss-size');
var colorShort = require('postcss-color-short');

var info = autoprefixer().info();
console.log(info);

var P_SCSS_PATH = 'node_modules/purecss-sass/vendor/assets/stylesheets';

var STYLE_PATH = 'public/css';
var JS_PATH = 'public/js';
var IMG_PATH = 'public/images';
var FONT_PATH = 'public/fonts';

// Styles

gulp.task('styles', function(){
   console.log('Starting style task');
   var processors = [
      alias(),
      crip(),
      magician(),
      triangle(),
      circle(),
      linkColors(),
      center(),
      clearfix(),
      position(),
      size(),
      colorShort(),
      autoprefixer({ browsers: ['>0%']}),
      cssnano()
];
   return gulp.src('resources/scss/style.scss')
   .pipe(wait(500))
   .pipe(plumber(function(err){
   		console.log('Styles Task Error');
   		console.log(err);
   		this.emit('end');
   }))
   .pipe(sass({
		outputStyle: 'compressed'
	 }))
   .pipe(postcss(processors))
   .pipe(rename('style.min.css'))
   .pipe(sourcemaps.init())
   .pipe(sourcemaps.write('maps/'))
   .pipe(gulp.dest(STYLE_PATH))
   .pipe(livereload());
});



// Script

gulp.task('scripts', function(){
	console.log('Starting Script task');
	return gulp.src('resources/js/**/*.js')
	.pipe(plumber(function(err){
   		console.log('Styles Task Error');
   		console.log(err);
   		this.emit('end');
     }))
	.pipe(concat('main.js'))
	//.pipe(uglify())
	.pipe(gulp.dest(JS_PATH))
	.pipe(livereload());
});

// Pure Styles

gulp.task('PureStyle', function(){
	console.log('Starting Pure Style task');
	return gulp.src(P_SCSS_PATH + '/purecss.scss')
	.pipe(plumber(function(err){
   		console.log('Styles Task Error');
   		console.log(err);
   		this.emit('end');
     }))
	.pipe(sass({
		outputStyle: 'compressed'
	}))
  .pipe( postcss([ autoprefixer()]) )
  .pipe(rename('pure.min.css'))
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('maps/'))
	.pipe(gulp.dest(STYLE_PATH))
	.pipe(livereload());
});


// Images Compression

gulp.task('images',function(){
    console.log('Starting Image compression task');
    return gulp.src('resources/images/**/*.{png,jpg,jpeg,svg,gif}')
    	.pipe(imagemin(
    			[
    				imagemin.gifsicle(),
    				imagemin.jpegtran(),
    				imagemin.optipng(),
    				imagemin.svgo(),
    				imagePngquant(),
    				imageRecompress()
    			]
   		))
   	.pipe(gulp.dest(IMG_PATH))
});

// Fonts

// gulp.task('BootstrpFonts', function(){
//   console.log('Starting Bootstrap Font task');
//   return gulp.src(BOOTSTRAP_FONT_PATH + '/glyphicons-halflings-regular.*')
//   .pipe(plumber(function(err){
//       console.log('Bootstrap Font task Task Error');
//       console.log(err);
//       this.emit('end');
//      }))
//   .pipe(gulp.dest(FONT_PATH + '/bootstrap'))
// });
// gulp.task('FontAweosme', function(){
//   console.log('Starting Fontawesome Style task');
//   return gulp.src(FONTAWESOME_SCSS_PATH + '/font-awesome.scss')
//   .pipe(plumber(function(err){
//       console.log('Fontawesome Style Task Error');
//       console.log(err);
//       this.emit('end');
//      }))
//   .pipe(sass({
//     outputStyle: 'compressed'
//    }))
//   .pipe(gulp.dest(STYLE_PATH))
// });

// gulp.task('FontAwesomeFonts', function() {
//     return gulp.src(FONTAWESOME_FONT_PATH + '/fontawesome-webfont.*')
//     	.pipe(plumber(function(err){
// 	      console.log('Font Aweosme Icon Font task Task Error');
// 	      console.log(err);
// 	      this.emit('end');
// 	     }))
//         .pipe(gulp.dest(FONT_PATH + '/fontawesome'));
// }); 

gulp.task('default',['styles','scripts','PureStyle','images'], function(){
	console.log('Default task running');
});


gulp.task('watch', ['default'], function(){
	console.log('Watch task running');
	require('./server.js');
	livereload.listen();
	gulp.watch('resources/scss/**/*.scss', ['styles']).on('change', livereload.changed);
	gulp.watch('resources/js/**/*.js', ['scripts']).on('change', livereload.changed);
  gulp.watch(P_SCSS_PATH + '/**/*.scss', ['PureStyle']).on('change', livereload.changed);
	gulp.watch(IMG_PATH, ['images']).on('change', livereload.changed);
	gulp.watch('public/*.html').on('change', livereload.changed);
});