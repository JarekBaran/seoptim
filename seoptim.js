#!/usr/bin/env node
const fs = require("fs");
const openExplorer = require('open-file-explorer');

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
    quality: 78,
    progressive: true
  })], { verbose: true }))
  .pipe(size({ showFiles: true }))
  .pipe(dest(output));

const guetzli = () => src("**/*.{jpg,jpeg}")
  .pipe(plumber())
  .pipe(imagemin([imageminGuetzli({ quality: 80 })], { verbose: true }))
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

const standard = parallel(png, jpg, gif);

const openDir = () => {
  openExplorer(output);
  console.log("Output folder: " + output );
}

const optimize = (method) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(output, {recursive: true}, err => {});
    resolve(method());
  })
}

const seoptim = async () => {

  program
  .option("--png")
  .option("--jpg")
  .option("--gif")
  .option("--svg")
  .option("--html")
  .option("--css")
  .option("--js")
  .option("--webp")
  .option("--tinypng", "PNG/JPG/JPEG")
  .option("--guetzli", "JPG/JPEG")
  .option("--zopfli", "PNG")
  .option("--less", "CSS")
  .option("--scss", "CSS")
  .parse(process.argv);

  if (program.gif) return await optimize(gif).then(openDir());
  if (program.png) return optimize(png).then(openDir());
  if (program.jpg) return optimize(jpg).then(openDir());
  if (program.guetzli) return optimize(guetzli).then(openDir());
  if (program.zopfli) return optimize(zopfli).then(openDir());
  if (program.tinypng) return optimize(tinypng).then(openDir());
  if (program.svg) return optimize(svg).then(openDir());
  if (program.webp) return optimize(webp).then(openDir());
  if (program.html) return optimize(html).then(openDir());
  if (program.js) return optimize(js).then(openDir());
  if (program.css) return optimize(css).then(openDir());
  if (program.scss) return optimize(scss).then(openDir());
  if (program.less) return optimize(less).then(openDir());
  if (process.argv.length === 2) return optimize(standard).then(openDir());
}

seoptim();
