/* jshint node: true */
const gulp        = require('gulp');
const clean       = require('gulp-clean');
const gulpConcat  = require('gulp-concat');
const gulpConnect = require('gulp-connect');
const emCompiler  = require('./bower_components/ember/ember-template-compiler');
const htmlbars    = require('gulp-htmlbars-compiler');
const wrapAmd     = require('gulp-wrap-amd');
const replace     = require('gulp-replace');
const argv        = require('yargs').argv;
const pkg         = require('./package.json');

const BASE        = 'component/';
const DIST        = 'dist/';
const TMP         = 'tmp/';
const ASSETS      = 'assets/';
const DRIVER_NAME = 'terraform';

console.log('Driver Name:', DRIVER_NAME);

gulp.task('default', ['build']);

gulp.task('server', ['build'], function() {
  return gulpConnect.server({
    root: [DIST],
    port: process.env.PORT || 3000,
    https: false
  });
});

gulp.task('clean', function() {
  return gulp.src([DIST, TMP], {read: false})
  .pipe(clean());
});

gulp.task('js', function() {
  return gulp.src([
    BASE + '*.js'
  ])
  .pipe(gulpConcat('component.js',{newLine: ';\n'}))
  .pipe(gulp.dest(TMP));
});

gulp.task('css', function() {
  return gulp.src([
    BASE + '**.css'
  ])
  .pipe(gulpConcat('component.css',{newLine: ';\n'}))
  .pipe(gulp.dest(DIST));
});

gulp.task('assets', function() {
  return gulp.src(ASSETS+'*')
  .pipe(gulp.dest(DIST));
});

gulp.task('compiled', ['js'], function() {
  return gulp.src(BASE +'**/*.hbs')
  .pipe(htmlbars({compiler: emCompiler}))
  .pipe(wrapAmd({
    deps: ['exports', 'ember', 'ui/mixins/driver'],
    params: ['exports', '_ember', '_uiMixinsDriver'],
    moduleRoot: 'component/',
    modulePrefix: 'ui/components/machine/driver-' + DRIVER_NAME + '/'
  }))
  .pipe(replace(
    "return Ember.TEMPLATES['template']", 'exports["default"]'
  ))
  .pipe(gulpConcat('template.js'), {newLine: ';\n'})
  .pipe(gulp.dest(TMP));
});

gulp.task('build', ['compiled','css','assets'], function() {
  return gulp.src([`${TMP}/*.js`])
  .pipe(gulpConcat('component.js',{newLine: ';\n'}))
  .pipe(gulp.dest(DIST));
});
