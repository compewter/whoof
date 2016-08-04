var gulp = require('gulp');
var mocha = require('gulp-mocha');
var exit = require('gulp-exit');
var shell = require('gulp-shell')
var nodemon = require('gulp-nodemon')

var env = require('./.env.json');

gulp.task('sauce-connect', shell.task([
	'node_modules/sauce-connect-launcher/sc/sc-*/bin/sc -u ' + env.SAUCE_USERNAME + ' -k ' + env.SAUCE_ACCESS_KEY + ' -v'
]));

gulp.task('start', function () {
  nodemon({
    script: 'server/server.js'
  });
});

gulp.task('test', ['allServerTests'], function(){
  gulp.start('allBrowserTests');
});


//Server Tests
gulp.task('allServerTests', function () {
  return gulp.src(['server/specs/**/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec'}));
  				 // .pipe(exit());
});

gulp.task('adminServerTests', function () {
  return gulp.src(['server/specs/adminApp/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec'}))
  				 .pipe(exit());
});

gulp.task('userServerTests', function () {
  return gulp.src(['server/specs/userApp/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec'}))
  				 .pipe(exit());
});


//Browser Tests
gulp.task('allBrowserTests', ['start'], function () {
  return gulp.src(['client/specs/browser/**/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec', timeout: 10000}))
  				 .pipe(exit());
});

gulp.task('adminBrowserTests', function () {
  return gulp.src(['client/specs/browser/adminApp/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec', timeout: 10000}))
  				 .pipe(exit());
});

gulp.task('userBrowserTests', function () {
  return gulp.src(['client/specs/browser/userApp/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec', timeout: 10000}))
  				 .pipe(exit());
});