const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const del = require('del');
const log = require('fancy-log');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const critical = require('critical');
const browserSync = require('browser-sync');


/*******************
 * Variables
 *******************/

const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist'
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: 'dist/fonts'
  },
  sass: {
    src: 'src/sass/**/*.sass',
  },
  scss: {
    src: 'src/scss/**/*.scss',
  },
  css: {
    src: 'src/css/**/*.css',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**/*',
    dest: 'dist/img'
  }
};


const finalFiles = {
  css: ['css/styles.min.css'],
  js: ['js/scripts.min.js']
};

const asset = {
  css: [
    'css/bootstrap.css',
    'css/font-awesome.min.css',
    'css/animate.css',
    'css/jquery-ui.css',
    'css/magnific-popup.css',
    'css/owl.carousel.css',
    'css/select2.min.css',
    'css/simple-line-icons.css',
    'css/slick.css',
    'css/trumbowyg.min.css',
    'css/venobox.css',
    'css/style.css',
  ],
  js: [
    'js/jquery.min.js',
    'js/uikit.min.js',
    'js/popper.js',
    'js/bootstrap.min.js',
    'js/chart.bundle.min.js',
    'js/grid.min.js',
    'js/jquery-ui.min.js',
    'js/jquery.barrating.min.js',
    'js/jquery.countdown.min.js',
    'js/jquery.counterup.min.js',
    'js/jquery.easing1.3.js',
    'js/jquery.magnific-popup.min.js',
    'js/owl.carousel.min.js',
    'js/select2.full.min.js',
    'js/slick.min.js',
    'js/tether.min.js',
    'js/trumbowyg.min.js',
    'js/venobox.min.js',
    'js/waypoints.min.js',
    'js/dashboard.js',
    'js/main.js',
    'js/map.js',
  ],
};

const srcAsset = {
    css: [],
    js: []
  },
  distAsset = {
    css: [],
    js: []
  };

function convertToFileSource(srcFiles, folderName, arrayName) {
  srcFiles.css.forEach((element) => {
    arrayName.css.push(folderName + '/' + element);
  });
  srcFiles.js.forEach((element) => {
    arrayName.js.push(folderName + '/' + element);
  });
}
convertToFileSource(asset, 'src', srcAsset);
convertToFileSource(finalFiles, 'dist', distAsset);


/*******************
 * Asset injection
 *******************/

function injectSrcAssets() {
  return gulp
    .src(paths.html.src)
    .pipe(plugins.inject(gulp.src(asset.css, {
      read: false,
      addRootSlash: true,
      cwd: __dirname + '/src'
    }), {
      starttag: '<!-- inject:header:{{ext}} -->'
    }))
    .pipe(plugins.inject(gulp.src(asset.js, {
      read: false,
      addRootSlash: true,
      cwd: __dirname + '/src'
    }), {
      starttag: '<!-- inject:footer:{{ext}} -->'
    }))
    .pipe(gulp.dest('./src'));
}


function injectDistAssets() {
  return gulp
    .src('dist/*.html')
    .pipe(plugins.inject(gulp.src(finalFiles.css, {
      read: false,
      addRootSlash: true,
      cwd: __dirname + '/dist'
    }), {
      starttag: '<!-- inject:header:{{ext}} -->'
    }))
    .pipe(plugins.inject(gulp.src(finalFiles.js, {
      read: false,
      addRootSlash: true,
      cwd: __dirname + '/dist'
    }), {
      starttag: '<!-- inject:footer:{{ext}} -->'
    }))
    .pipe(gulp.dest('./dist'));
}


/*******************
 * HTML Tasks
 *******************/
function minifyHTML() {
  return gulp
    .src('dist/*.html')
    .pipe(plugins.htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      removeEmptyAttributes: true
    }))
    .pipe(gulp.dest('dist/'));
}

/*******************
 * JS Tasks
 *******************/

function concatJS() {
  return gulp
    .src(srcAsset.js)
    .pipe(plugins.concat('scripts.min.js'))
    .pipe(plugins.size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(paths.scripts.dest));
}

function babelConvert() {
  return gulp
    .src('src/js/main.js')
    .pipe(plugins.babel({
      presets: ['@babel/env']
    }))
    .on('end', function () {
      log('Done babel compiling...');
    })
    .pipe(gulp.dest(paths.scripts.src));
}

function minifyJS() {
  return gulp
    .src(distAsset.js)
    .pipe(
      plugins.sourcemaps.init({
        loadMaps: true,
        largeFile: true,
      })
    )
    .pipe(plugins.uglify())
    .on('end', function () {
      log('Done uglifying...');
    })
    .pipe(plugins.sourcemaps.write('./maps/'))
    .pipe(plugins.size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(paths.scripts.dest));
}


/*******************
 * CSS Tasks
 *******************/

//use to concat css files
function concatCSS() {
  return gulp.src(srcAsset.css)
    .pipe(plugins.concat('styles.min.css'))
    .pipe(plugins.size({
      showFiles: true,
      gzip: true
    }))
    .on('error', function (err) {
      log.error(err.message);
    })
    .pipe(gulp.dest(paths.css.dest));
}


function compileSCSS() {
  return gulp
    .src('./src/scss/style.scss')
    .pipe(plugins.sass({outputStyle: 'expanded'}).on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.write('maps'))
    .pipe(plugins.size({
      showFiles: true,
      gzip: true
    }))
    .pipe(plugins.rename('style.css'))
    .pipe(gulp.dest('./src/css/'));
}

function RemoveCSS() {
  let uncssOptions = {
    html: ['dist/*.html'],
  };
  return gulp
    .src('src/css/bootstrap.min.css')
    .pipe(plugins.postcss([
      require('autoprefixer'),
      require('cssnano'),
    ]))
    .pipe(plugins.uncss(uncssOptions))
    .on('error', function (err) {
      log.error(err.message);
    })
    .pipe(gulp.dest('dist/'));
}

function minifyCSS() {
  return gulp
    .src(distAsset.css)
    .pipe(
      plugins.sourcemaps.init({
        loadMaps: true,
        largeFile: true,
      })
    )
    .pipe(plugins.postcss([
      require('autoprefixer'),
      require('cssnano')
    ]))
    .on('error', function (err) {
      log.error(err.message);
    })
    .pipe(plugins.sourcemaps.write('./maps/'))
    .pipe(plugins.size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(paths.css.dest));
}



/*******************
 * Build Tasks
 *******************/
function copyHTML() {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest('dist'));
}

function copyFonts(done) {
  gulp.src(paths.fonts.src)
    .pipe(gulp.dest('dist/fonts'));
  done();
}

const clean = () => del(['dist']);

// FindOut Critical CSS
function extractCriticalCSS(done) {
  // code...
  critical.generate({
    inline: true,
    base: './dist',
    dimensions: [{
      width: 320,
      height: 480
    }, {
      width: 768,
      height: 1024
    }, {
      width: 1280,
      height: 960
    }],
    src: 'index.html',
    dest: 'index.html',
    minify: true,
    extract: false,
    ignore: ['@font-face', /url\(/]
  });
  done();
}

function imgMin() {
  //use to optimize images
  return gulp
    .src(paths.images.src)
    .pipe(plugins.changed(paths.images.dest))
    .pipe(
      imagemin([
        imagemin.gifsicle({
          interlaced: true,
        }),
        imageminMozjpeg({
          quality: 75,
          progressive: true
        }),
        imagemin.optipng({
          optimizationLevel: 5,
        }),
        imagemin.svgo({
          plugins: [{
            removeViewBox: true
          }, {
            cleanupIDs: false,
            collapseGroups: true
          }]
        })
      ])
    )
    .on('error', function (err) {
      log.error(err.message);
    })
    .pipe(plugins.size({
      showFiles: true,
      gzip: true
    }))
    .pipe(gulp.dest(paths.images.dest));
}


/*****************************
 * Watch Files and Live reload
 ****************************/
// watch Sass files for changes, run the Sass preprocessor with the 'sass' task and reload
function serve() {
  browserSync.init({
    open: false,
    port: 8000,
    server: {
      baseDir: 'src/',
      index: 'index.html'
    },
  });
  gulp.watch(paths.scss.src, gulp.series([compileSCSS]));
  gulp.watch(paths.images.src, gulp.series([imgMin]));
  gulp.watch([paths.html.src, paths.scripts.src, paths.scss.src]).on('change', browserSync.reload);
}


/*******************
 * Gulp Tasks
 *******************/
const serveTasks = gulp.series([injectSrcAssets, serve]);
const buildTasks = gulp.series([clean, copyHTML, copyFonts, concatJS, minifyJS, compileSCSS, concatCSS, minifyCSS, injectDistAssets, imgMin, extractCriticalCSS]);

exports.default = serveTasks;
exports.build = buildTasks;




// function CSSBuild() {
//   let uncssOptions = {
//     html: ['dist/*.html'],
//   };
//   return gulp
//     .src('src/css/bootstrap.min.css')
//     .pipe(plugins.postcss([
//       require('autoprefixer'),
//       require('cssnano'),
//     ]))
//     .pipe(plugins.uncss(uncssOptions))
//     .on('error', function (err) {
//       log.error(err.message);
//     })
//     .pipe(gulp.dest('dist/'));
// }
