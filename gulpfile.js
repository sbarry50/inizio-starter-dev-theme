'use strict';

var gulp = require('gulp'),

    // Sass/CSS processes
    bourbon = require('bourbon').includePaths,
    neat = require('bourbon-neat').includePaths,
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    // cssMQPacker = require('css-mqpacker'),
    sourcemaps = require('gulp-sourcemaps'),
    cssMinify = require('gulp-cssnano'),
    sassLint = require('gulp-sass-lint'),
    modernizr = require('gulp-modernizr'),

    // Utilities
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');


/*********************
 * Utilities
 *********************/

/**
 * Error Handling
 *
 * @function
 */
function handleErrors() {
    var args = Array.prototype.slice.call(arguments);

    notify.onError({
        title: 'Task Failed [<%= error.message %>',
        message: 'See console.',
        sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).apply(this, args);

    gutil.beep(); // Beep 'sosumi' again

    // Prevent the 'watch' task from stopping
    this.emit('end');
}

/*********************
 * CSS Tasks
 *********************/

/**
 * PostCSS Task handler
 */
gulp.task('postcss', function() {

    return gulp.src( 'assets/sass/style.scss' )

        // Error Handling
        .pipe(plumber({
           errorHandler: handleErrors
        }))

        // Wrap tasks in a sourcemap
        .pipe(sourcemaps.init())

        .pipe( sass({
            includePaths: [].concat( bourbon, neat ),
            errLogToConsole: true,
            outputStyle: 'expanded' // Options: nested, expanded, compact, compressed
        }))

        .pipe( postcss([
            autoprefixer({
                browsers: ['last 2 versions']
            })
            // cssMQPacker({
            //     sort: true
            // })
        ]))

        // Creates the sourcemap
        .pipe(sourcemaps.write())

        .pipe(gulp.dest('./'));
});

gulp.task('css:minify', ['postcss'], function() {
   return gulp.src('style.css')

        // Error Handling
       .pipe(plumber({
           errorHandler: handleErrors
       }))

       .pipe( cssMinify({
           safe: true
       }))
       .pipe(rename('style.min.css'))
       .pipe(gulp.dest('./'))
       .pipe(notify({
           message: 'Styles are built.'
       }))
});

gulp.task('sass:lint', ['css:minify'], function() {
    gulp.src([
        'assets/sass/style.scss',
        '!assets/sass/base/html5-reset/_normalize.scss',
        '!assets/sass/utilities/animate/**/*.*'
    ])
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

gulp.task('modernizr', function() {
    gulp.src('assets/js/*.js')
        .pipe(modernizr('modernizr-custom.js'))
        .pipe(modernizr({
            "tests" : ['flexbox']
        }))
        .pipe(gulp.dest('./'))
});
/*********************
 * All Tasks Listeners
 *********************/

gulp.task('watch', function() {
    gulp.watch( 'assets/sass/**/*.scss', ['styles'] );
});

/**
 * Individual tasks.
 */

// gulp.task('scripts', [''])
gulp.task('styles', ['sass:lint'] );