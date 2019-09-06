const gulp = require("gulp");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const gutil = require("gulp-util");
const rename = require("gulp-rename");
const cssnano = require("cssnano");
const browerSync = require("browser-sync");
const nodemon = require("gulp-nodemon");
const plumber = require("gulp-plumber");
const path = require("path");

let bSync = browerSync.create();
const PATHS = {
  src_scss: "./src/public/scss/",
  src_js: "./src/public/js/",
  src_node: "./src/",
  dist_scss: "./dist/public/css/",
  dist_js: "./dist/public/js/",
  dist_node: "./dist/"
};

let onError = err => {
  gutil.beep();
  console.log(err);
};

gulp.task("sass", () => {
  let plgs = [autoprefixer({ browsers: ["last 2 versions"] }), cssnano()];

  return gulp
    .src(path.join(PATHS.src_scss, "*.scss"))
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(plgs))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(PATHS.dist_scss))
    .pipe(bSync.stream());
});

gulp.task("babel", () => {
  return gulp
    .src(path.join(PATHS.src_js, "*.js"))
    .pipe(plumber({ errorHandler: onError }))
    .pipe(babel({ presets: ["env"] }))
    .pipe(gulp.dest(PATHS.dist_js));
});

gulp.task("babel-server", () => {
  return gulp
    .src(
      [
        path.join(PATHS.src_node, "*.js"),
        path.join(PATHS.src_node, "./configs/**/*.js"),
        path.join(PATHS.src_node, "./models/**/*.js"),
        path.join(PATHS.src_node, "./routes/**/*.js"),
        path.join(PATHS.src_node, "./services/**/*.js")
      ],
      { base: "./src" }
    )
    .pipe(gulp.dest(PATHS.dist_node))
    .pipe(babel({ presets: ["es2015", "stage-2"] }))
    .pipe(gulp.dest(PATHS.dist_node));
});

gulp.task("nodemon", cb => {
  let started = false;

  return nodemon({
    script: "dist/app.js"
  }).on("start", () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task("mv-tmpl", () => {
  return gulp
    .src(path.join(PATHS.src_node, "./views/**/*.hbs"), { base: "./src" })
    .pipe(gulp.dest(PATHS.dist_node));
});

gulp.task(
  "default",
  ["sass", "babel", "mv-tmpl", "babel-server", "nodemon"],
  () => {
    bSync.init(null, {
      proxy: "http://localhost:9000",
      port: 3000,
      files: ["./dist/**/*"]
    });

    gulp.watch("*.hbs").on("change", bSync.reload);
    gulp.watch(path.join(PATHS.src_scss, "*.scss"), ["sass"]);
    gulp.watch(path.join(PATHS.src_js, "*.js"), ["babel"]);
    gulp.watch(path.join(PATHS.src_node, "./**/*.js"), ["babel-server"]);
    gulp.watch(path.join(PATHS.src_node, "./**/*.hbs"), ["mv-tmpl"]);
  }
);
