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
const imageminZopfli = require("imagemin-zopfli");
const imageminSvgo = require("imagemin-svgo");
const imageminWebp = require("imagemin-webp");
const gulpTinyPng = require("gulp-tinypng-unlimited");
// config
const exec = require('child_process').exec;
const windows = /^win/.test(process.platform);
const folder = windows ? "C:\\SEOptim\\" : process.env.HOME + "/SEOptim/";
const output = folder + new Date().toISOString().slice(0,19).replace(/[^0-9]/g, "-");

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

const tinypng = () => src("**/*.{png,jpg,jpeg}")
  .pipe(plumber())
  .pipe(gulpTinyPng())
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const jpg = () => src("**/*.{jpg,jpeg}")
  .pipe(plumber())
  .pipe(imagemin([imageminMozjpeg({
    quality: 80,
    progressive: true
  })], { verbose: true }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const guetzli = () => src("**/*.{jpg,jpeg}")
  .pipe(plumber())
  .pipe(imagemin([imageminGuetzli({ quality: 85 })], { verbose: true }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const zopfli = () => src("**/*.png")
  .pipe(plumber())
  .pipe(imagemin([imageminZopfli({ more: true })], { verbose: true }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const svg = () => src("**/*.svg")
  .pipe(plumber())
  .pipe(imagemin([imageminSvgo()], { verbose: true }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const webp = () => src("**/*.{png,jpg,jpeg,gif,webp}")
  .pipe(plumber())
  .pipe(imagemin([imageminWebp({ lossless: true })], { verbose: true }))
  .pipe(rename({ extname: ".webp" }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const seoptim = parallel(png, jpg);

program
.option("--png")
.option("--jpg")
.option("--gif")
.option("--svg")
.option("--html")
.option("--css")
.option("--js")
.option("--webp", "PNG/JPG/JPEG/GIF/WEBP")
.option("--tinypng", "PNG/JPG/JPEG")
.option("--guetzli", "JPG/JPEG")
.option("--zopfli", "PNG")
.option("--less", "CSS")
.option("--scss", "CSS")
  .parse(process.argv);

  if (program.gif) gif();
  if (program.png) png();
  if (program.jpg) jpg();
  if (program.guetzli) guetzli();
  if (program.zopfli) zopfli();
  if (program.tinypng) tinypng();
  if (program.svg) svg();
  if (program.webp) webp();
  if (program.html) html();
  if (program.js) js();
  if (program.css) css();
  if (program.scss) scss();
  if (program.less) less();
  if (process.argv.length === 2) seoptim();


console.log("Output folder: " + output );

exec((windows ? 'start ' : 'open ') + output,
    function (error, stdout, stderr) {
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    }
);

