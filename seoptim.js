#!/usr/bin/env node

const program = require('commander');
const { src, dest, series, parallel } = require("gulp");
const imagemin = require("gulp-imagemin");
const imageminGifsicle = require('imagemin-gifsicle');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGuetzli = require('imagemin-guetzli');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');

const folder = process.platform === "win32" ? "C:\\SEOptim\\" : process.env.HOME + "/SEOptim/";
const output = folder + new Date().toISOString().slice(0,16).replace(/[^0-9]/g, "-");

const gif = () => src("**/*.gif")
  .pipe(imagemin([imageminGifsicle({ interlaced: true, optimizationLevel: 3 })], { verbose: true }))
  .pipe(dest(output));

const png = () => src("**/*.png")
  .pipe(imagemin([imageminPngquant({ quality: [0.6, 0.8] })], { verbose: true }))
  .pipe(dest(output));

const jpg = () => src("**/*.{jpg,jpeg}")
  .pipe(imagemin([imageminMozjpeg({
    quality: 80,
    progressive: true
  })], { verbose: true }))
  .pipe(dest(output));

const guetzli = () => src("**/*.{jpg,jpeg}")
  .pipe(imagemin([imageminGuetzli({ quality: 85 })], { verbose: true }))
  .pipe(dest(output));

const svg = () => src("**/*.svg")
  .pipe(imagemin([imageminSvgo()], { verbose: true }))
  .pipe(dest(output));

const webp = () => src("**/*.{png,jpg,jpeg,svg}")
  .pipe(imagemin([imageminWebp({ lossless: true })], { verbose: true }))
  .pipe(dest(output));

const seoptim = parallel(png, jpg);

program
  .option('--gif')
  .option('--png')
  .option('--jpg')
  .option('--guetzli')
  .option('--svg')
  .option('--webp')
  .parse(process.argv);

  if (program.gif) gif();
  if (program.png) png();
  if (program.jpg) jpg();
  if (program.guetzli) guetzli();
  if (program.svg) svg();
  if (program.webp) webp();
  if (process.argv.length === 2) seoptim();


console.log("Output folder: " + output );

