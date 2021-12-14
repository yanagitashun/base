const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssdeclsort = require("css-declaration-sorter");
const sassGlob = require("gulp-sass-glob");
const browserSync = require("browser-sync");
const gcmq = require("gulp-group-css-media-queries");
const pug = require("gulp-pug");
const mode = require("gulp-mode")({
  modes: ["production", "development"],
  default: "development",
  verbose: false,
});
const webpack = require("webpack");
const webpackStream = require("webpack-stream");

const webpackConfig = require("./webpack.config");

// pug
const compilePug = (done) => {
  src("./src/pug/**/*.pug")
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest("./dist"));
    done();
};

// sass
const compileSass = (done) => {
  const postcssPlugins = [
    autoprefixer({
      cascade: false,
    }),
    cssdeclsort({ order: "alphabetical" /* smacss, concentric-css */ }),
  ];

  src("./src/assets/scss/**/*.scss", { sourcemaps: true })
    .pipe(
      plumber({ errorHandler: notify.onError("Error: <%= error.message %>") })
    )
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(postcss(postcssPlugins))
    .pipe(mode.production(gcmq()))
    .pipe(dest("./dist/assets/css", { sourcemaps: "./sourcemaps" }));
  done();
};

// Server
const buildServer = (done) => {
  browserSync.init({
    port: 8010,
    notify: false,
    server: {
      baseDir: "./dist",
    },
  });
  done();
};

// ブラウザ自動リロード
const browserReload = (done) => {
  browserSync.reload();
  done();
};

// webpack
const bundleJs = () => {
  return webpackStream(webpackConfig, webpack).pipe(dest("./dist/assets/js"));
};

// ファイル監視
const watchFiles = () => {
  watch("./src/pug/**/*.pug", series(compilePug, browserReload));
  watch("./src/assets/scss/**/*.scss", series(compileSass, browserReload));
  watch("./src/assets/js/**/*.js", series(bundleJs, browserReload));
};

exports.sass = compileSass;
exports.default = parallel(buildServer, watchFiles);
