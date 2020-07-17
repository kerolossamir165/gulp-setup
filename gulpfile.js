/*************
 *  when using live reload 
 *  add this ti html 
 *  http://localhost:35729/livereload.js of chrom extintion 
 * 
 */

let gulp = require('gulp')
let lievreload = require("gulp-livereload")
let uglify = require('gulp-uglify')
let concat = require("gulp-concat")
let minifyCss = require('gulp-minify-css')
let autoprefixer = require('gulp-autoprefixer')
let sourcemap = require('gulp-sourcemaps')
let plumber = require("gulp-plumber")
let babel = require('gulp-babel')


// File paths
let DIST_PATH = 'public/dist';
let SCRIPTS_PATH = 'public/scripts/**/*.js';
let CSS_PATH = 'public/css/**/*.css';
let IMAGE_PATH = 'puplic/img/**/*.{png,jpeg,jpg,svg,gif}'


// Image compression
let imagemin = require('gulp-imagemin');
let imageminPngquant = require('imagemin-pngquant');
let imageminJpegRecompress = require('imagemin-jpeg-recompress');


// ZIP OUR FILE 
let zip = require('gulp-zip')

/******styles  */
/*******css ************************************************************/
gulp.task('style', function () {
    return gulp.src(CSS_PATH)
        .pipe(plumber(function (err) {
            console.log('Styles Task Error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemap.init())
        .pipe(autoprefixer({
            browsers: ['last 5 versions', 'ie 8']
        }))
        .pipe(concat('style.css'))
        .pipe(minifyCss())
        .pipe(sourcemap.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(lievreload())
})
/**********scss ****************************************************/
// install gulp-sass@2.1.1
// gulp.task('styles', function () {

// 	return gulp.src('public/scss/styles.scss')
// 		.pipe(plumber(function (err) {
// 			console.log('Styles Task Error');
// 			console.log(err);
// 			this.emit('end');
// 		}))
// 		.pipe(sourcemaps.init())
// 		.pipe(autoprefixer())
// 		.pipe(sass({
// 			outputStyle: 'compressed'
// 		}))
// 		.pipe(sourcemaps.write())
// 		.pipe(gulp.dest(DIST_PATH))
// 		.pipe(livereload());
// });



/***scripts **************************************************/
gulp.task('scripts', function () {
    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function (err) {
            console.log('start error for scripts')
            console.log(err)
            this.emit('end')
        }))
        .pipe(sourcemap.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(concat('script.js'))
        .pipe(sourcemap.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(lievreload())
})

/***images**************************************************************** */
gulp.task('images', function () {
    return gulp.src(IMAGES_PATH)
        .pipe(imagemin(
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminPngquant(),
                imageminJpegRecompress()
            ]
        ))
        .pipe(gulp.dest(DIST_PATH + '/images'));
})

/*/*****start default***************************************************************** */

gulp.task('default', ['images', 'styles', 'scripts'], function () {
    console.log('Starting default task');
});


/**********zip our file*********************************************** */
gulp.task('export', function () {

    return gulp.src('./puplic/**/*')
        .pipe(zip('website.zip'))
        .pipe(gulp.dest('./'))


})

/*****watch task************************************** */

gulp.task('watch', ['default'], function () {

    require('static-server.js')
    lievreload.listen()
    gulp.watch(SCRIPTS_PATH, ['scripts'])
    gulp.watch(CSS_PATH, ['styles'])
    // gulp.watch('public/scss/**/*.scss', ['styles']);

})