#!/usr/bin/env node

const { src, dest, series, parallel } = require("gulp");
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");
const size = require("gulp-size");
const program = require("commander");
// code
const htmlClean = require("gulp-htmlclean");
const gulpSass = require("gulp-sass");
const gulpLess = require("gulp-less");
const cssNano = require("gulp-cssnano");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
// image
const imagemin = require("gulp-imagemin");
const imageminGifsicle = require("imagemin-gifsicle");
const imageminPngquant = require("imagemin-pngquant");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminGuetzli = require("imagemin-guetzli");
const imageminSvgo = require("imagemin-svgo");
const imageminWebp = require("imagemin-webp");
// config
const folder = process.platform === "win32" ? "C:\\SEOptim\\" : process.env.HOME + "/SEOptim/";
const output = folder + new Date().toISOString().slice(0,16).replace(/[^0-9]/g, "-");

const html = () => src("**/*.{htm,html}")
  .pipe(plumber())
  .pipe(htmlClean())
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const scss = () => src("**/*.scss")
  .pipe(plumber())
  .pipe(gulpSass({ outputStyle: "compressed" }))
  .pipe(rename({ extname: ".css" }))
  .pipe(cssNano())
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const less = () => src("**/*.less")
  .pipe(plumber())
  .pipe(gulpLess())
  .pipe(rename({ extname: ".css" }))
  .pipe(cssNano())
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const css = () => src("**/*.css")
  .pipe(plumber())
  .pipe(cssNano())
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const js = () => src("**/*.js")
  .pipe(plumber())
  .pipe(uglify())
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const gif = () => src("**/*.gif")
  .pipe(plumber())
  .pipe(imagemin([imageminGifsicle({ interlaced: true, optimizationLevel: 3 })], { verbose: true }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const png = () => src("**/*.png")
  .pipe(plumber())
  .pipe(imagemin([imageminPngquant({ quality: [0.6, 0.8] })], { verbose: true }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const jpg = () => src("**/*.{jpg,jpeg}")
  .pipe(plumber())
  .pipe(imagemin([imageminMozjpeg({
    quality: 75,
    progressive: true
  })], { verbose: true }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const guetzli = () => src("**/*.{jpg,jpeg}")
  .pipe(plumber())
  .pipe(imagemin([imageminGuetzli({ quality: 80 })], { verbose: true }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const svg = () => src("**/*.svg")
  .pipe(plumber())
  .pipe(imagemin([imageminSvgo()], { verbose: true }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const webp = () => src("**/*.{png,jpg,jpeg}")
  .pipe(plumber())
  .pipe(imagemin([imageminWebp({ lossless: true })], { verbose: true }))
  .pipe(rename({ extname: ".webp" }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const seoptim = parallel(png, jpg);

program
  .option("--gif")
  .option("--png")
  .option("--jpg")
  .option("--guetzli")
  .option("--svg")
  .option("--webp")
  .option("--html")
  .option("--css")
  .option("--js")
  .option("--scss")
  .option("--less")
  .parse(process.argv);

  if (program.gif) gif();
  if (program.png) png();
  if (program.jpg) jpg();
  if (program.guetzli) guetzli();
  if (program.svg) svg();
  if (program.webp) webp();
  if (program.html) html();
  if (program.css) css();
  if (program.js) js();
  if (program.scss) scss();
  if (program.less) less();
  if (process.argv.length === 2) seoptim();


console.log("Output folder: " + output );

