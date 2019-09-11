const {
  src, dest, parallel, task, series, watch,
} = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const cssnano = require('cssnano');
const browerSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const path = require('path');

const bSync = browerSync.create();
const PATHS = {
  src_scss: './src/public/scss/',
  src_js: './src/public/js/',
  src_node: './src/',
  dist_scss: './dist/public/css/',
  dist_js: './dist/public/js/',
  dist_node: './dist/',
};

const onError = (err) => {
  gutil.beep();
  console.log(err);
};

// gulp.task('sass', () => {
//   const plgs = [autoprefixer({ browsers: ['last 2 versions'] }), cssnano()];

//   return gulp
//     .src(path.join(PATHS.src_scss, '*.scss'))
//     .pipe(sass().on('error', sass.logError))
//     .pipe(postcss(plgs))
//     .pipe(rename({ suffix: '.min' }))
//     .pipe(gulp.dest(PATHS.dist_scss))
//     .pipe(bSync.stream());
// });

function templates() {
  const plgs = [autoprefixer({ browsers: ['last 2 versions'] }), cssnano()];

  return src(path.resolve(PATHS.src_scss, '*.scss'))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plgs))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(PATHS.dist_scss))
    .pipe(bSync.stream());
}

// gulp.task('babel', () => gulp
//   .src(path.join(PATHS.src_js, '*.js'))
//   .pipe(plumber({ errorHandler: onError }))
//   .pipe(babel({ presets: ['env'] }))
//   .pipe(gulp.dest(PATHS.dist_js)));

function logBabel() {
  return src(path.join(PATHS.src_js, '*.js'))
    .pipe(plumber({ errorHandler: onError }))
    .pipe(babel({ presets: ['env'] }))
    .pipe(dest(PATHS.dist_js));
}

// gulp.task('babel-server', () => gulp
//   .src(
//     [
//       path.join(PATHS.src_node, '*.js'),
//       path.join(PATHS.src_node, './configs/**/*.js'),
//       path.join(PATHS.src_node, './models/**/*.js'),
//       path.join(PATHS.src_node, './routes/**/*.js'),
//       path.join(PATHS.src_node, './services/**/*.js'),
//     ],
//     { base: './src' },
//   )
//   .pipe(gulp.dest(PATHS.dist_node))
//   .pipe(babel({ presets: ['es2015', 'stage-2'] }))
//   .pipe(gulp.dest(PATHS.dist_node)));

function logBabelServer() {
  return src(
    [
      path.join(PATHS.src_node, '*.js'),
      path.join(PATHS.src_node, './configs/**/*.js'),
      path.join(PATHS.src_node, './models/**/*.js'),
      path.join(PATHS.src_node, './routes/**/*.js'),
      path.join(PATHS.src_node, './services/**/*.js'),
    ],
    { base: './src' },
  )
    .pipe(dest(PATHS.dist_node))
    .pipe(babel({ presets: ['es2015', 'stage-2'] }))
    .pipe(dest(PATHS.dist_node));
}

// gulp.task('nodemon', (cb) => {
//   let started = false;

//   return nodemon({
//     script: 'dist/app.js',
//   }).on('start', () => {
//     if (!started) {
//       cb();
//       started = true;
//     }
//   });
// });

function logNodemon(cb) {
  let started = false;

  return nodemon({
    script: 'dist/app.js',
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  });
}

// gulp.task('mv-tmpl', () => gulp
//   .src(path.join(PATHS.src_node, './views/**/*.hbs'), { base: './src' })
//   .pipe(gulp.dest(PATHS.dist_node)));

function mvTmpl() {
  return src(path.join(PATHS.src_node, './views/**/*.hbs'), { base: './src' }).pipe(
    dest(PATHS.dist_node),
  );
}

// gulp.task('default', ['sass', 'babel', 'mv-tmpl', 'babel-server', 'nodemon'], () => {
//   bSync.init(null, {
//     proxy: 'http://localhost:9000',
//     port: 3000,
//     files: ['./dist/**/*'],
//   });

//   gulp.watch('*.hbs').on('change', bSync.reload);
//   gulp.watch(path.join(PATHS.src_scss, '*.scss'), ['sass']);
//   gulp.watch(path.join(PATHS.src_js, '*.js'), ['babel']);
//   gulp.watch(path.join(PATHS.src_node, './**/*.js'), ['babel-server']);
//   gulp.watch(path.join(PATHS.src_node, './**/*.hbs'), ['mv-tmpl']);
// });

function runbrowerSync() {
  bSync.init(null, {
    proxy: 'http://localhost:9000',
    port: 3000,
    files: ['./dist/**/*'],
  });

  watch('*.hbs').on('change', bSync.reload);
  watch(path.join(PATHS.src_scss, '*.scss'), templates);
  watch(path.join(PATHS.src_js, '*.js'), logBabel);
  watch(path.join(PATHS.src_node, './**/*.js'), logBabelServer);
  watch(path.join(PATHS.src_node, './**/*.hbs'), mvTmpl);
}

task('default', parallel(templates, logBabel, mvTmpl, logBabelServer, logNodemon, runbrowerSync));
