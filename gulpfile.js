var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var shell       = require('gulp-shell');

gulp.task('jekyll-watch', shell.task(['jekyll build --watch --incremental']));

gulp.task('copy_bower_components', function() {
    gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
        'bower_components/fontawesome/css/font-awesome.min.css',
        'bower_components/normalize.css/normalize.css'
        ]).pipe(gulp.dest('./_site/vendor/css/'));
    gulp.src([
        'bower_components/bootstrap/dist/fonts/*',
        'bower_components/fontawesome/fonts/*',
        ]).pipe(gulp.dest('./_site/vendor/fonts/'));
    gulp.src([
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/jquery/dist/jquery.min.js',
        ]).pipe(gulp.dest('./_site/vendor/js/'));
    gulp.src([
        'bower_components/modernizr/modernizr.js',
        ]).pipe(uglify())
        .pipe(gulp.dest('./_site/vendor/js/'));
});

gulp.task('webserver', function () {
    browserSync.init({
        port: 4000,
        open: true,
        reloadThrottle: 500,
        reloadDebounce: 500,
        server: {
            baseDir: '_site/'
        }
    });
    setTimeout(function () {
        gulp.watch('_site/**/*.*').on('change', browserSync.reload);
    }, 5000);
})

gulp.task('serve', ['jekyll-watch', 'copy_bower_components', 'webserver'], function () {});
