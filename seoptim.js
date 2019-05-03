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
  .version('1.0.0')
  .option("-p, --png")
  .option("-j, --jpg")
  .option("-g, --gif")
  .option("-s, --svg")
  .option("-h, --html")
  .option("-c, --css")
  .option("-js, --js")
  .option("-w, --webp")
  .option("-t, --tinypng", "PNG/JPG/JPEG")
  .option("-q, --guetzli", "JPG/JPEG")
  .option("-z, --zopfli", "PNG")
  .option("-l, --less", "CSS")
  .option("-sc, --scss", "CSS")
  .parse(process.argv);

  if (program.gif) return await optimize(gif).then(openDir());
  else if (program.png) return optimize(png).then(openDir());
  else if (program.jpg) return optimize(jpg).then(openDir());
  else if (program.guetzli) return optimize(guetzli).then(openDir());
  else if (program.zopfli) return optimize(zopfli).then(openDir());
  else if (program.tinypng) return optimize(tinypng).then(openDir());
  else if (program.svg) return optimize(svg).then(openDir());
  else if (program.webp) return optimize(webp).then(openDir());
  else if (program.html) return optimize(html).then(openDir());
  else if (program.js) return optimize(js).then(openDir());
  else if (program.css) return optimize(css).then(openDir());
  else if (program.scss) return optimize(scss).then(openDir());
  else if (program.less) return optimize(less).then(openDir());
  else if (process.argv.length === 2) return optimize(standard).then(openDir());
}

seoptim();
