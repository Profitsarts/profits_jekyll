var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var cp = require('child_process');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ bundle exec jekyll build'
};

// Jekyll build task (usa bundle exec SIEMPRE para gems correctas)
gulp.task('jekyll-build', function(done) {
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit' })
    .on('close', done);
});

// SASS Compilation
gulp.task('sass-rebuild', function() {
  var plugins = [autoprefixer(), cssnano()];
  return gulp.src('assets/css/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/css/'))
    .pipe(gulp.dest('_site/assets/css/'))
    .pipe(browserSync.stream());
});

// JS Task (simple copy, add minify if needed)
gulp.task('js-rebuild', function() {
  return gulp.src('assets/js/**/*.js')
    .pipe(gulp.dest('_site/assets/js/'))
    .pipe(browserSync.stream());
});

// Copy images (for development)
gulp.task('images-rebuild', function() {
  return gulp.src('assets/img/**/*.*')
    .pipe(gulp.dest('_site/assets/img/'))
    .pipe(browserSync.stream());
});

// Manual optimization of images (when you want)
gulp.task('imagemin', function() {
  return gulp.src('assets/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img/'));
});

// BrowserSync config for /profits_jekyll routing - MEJORADO para Chrome
gulp.task('serve', ['jekyll-build', 'sass-rebuild', 'js-rebuild', 'images-rebuild'], function() {
  browserSync.init({
    port: 3000,
    server: {
      baseDir: './',
      routes: {
        '/profits_jekyll': '_site'
      }
    },
    startPath: '/profits_jekyll/',
    
    // MEJORAS para Chrome (sin afectar Safari)
    injectChanges: false,
    reloadDelay: 500,
    
    // Headers selectivos solo para JS (no cache completo)
    middleware: function (req, res, next) {
      if (req.url.indexOf('/assets/js/') !== -1) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      next();
    }
  });

  gulp.watch('assets/css/**/*.scss', ['sass-rebuild']);
  gulp.watch('assets/js/**/*.js', ['js-rebuild']);
  gulp.watch('assets/img/**/*.*', ['images-rebuild']);
  gulp.watch([
      '**/*.*',
      '!_site/**/*',
      '!assets/css/**/*',
      '!assets/js/**/*',
      '!assets/img/**/*',
      '!node_modules/**/*'
  ], ['jekyll-rebuild']);
});

// This task rebuilds Jekyll and reloads BrowserSync
gulp.task('jekyll-rebuild', ['jekyll-build'], function(done) {
  // MEJORA: Delay específico para Revolution Slider
  setTimeout(function() {
    browserSync.reload();
    done();
  }, 500);
});

gulp.task('default', ['serve']);
