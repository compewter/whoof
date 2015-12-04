var gulp = require('gulp');
var mocha = require('gulp-mocha');
var exit = require('gulp-exit');
var shell = require('gulp-shell')

var env = require('./.env.json');

gulp.task('sauce-connect', shell.task([
	'node_modules/sauce-connect-launcher/sc/sc-*/bin/sc -u ' + env.SAUCE_USERNAME + ' -k ' + env.SAUCE_ACCESS_KEY + ' -v'
]));



//Server Tests
gulp.task('allServerTests', function () {
  return gulp.src(['server/specs/**/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec'}))
  				 .pipe(exit());
});

gulp.task('adminServerTests', function () {
  return gulp.src(['server/specs/adminApp/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec'}))
  				 .pipe(exit());
});

gulp.task('clientServerTests', function () {
  return gulp.src(['server/specs/clientApp/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec'}))
  				 .pipe(exit());
});



//Browser Tests
gulp.task('allBrowserTests', function () {
  return gulp.src(['client/specs/**/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec', timeout: 10000}))
  				 .pipe(exit());
});

gulp.task('adminBrowserTests', function () {
  return gulp.src(['client/specs/adminApp/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec', timeout: 10000}))
  				 .pipe(exit());
});

gulp.task('clientBrowserTests', function () {
  return gulp.src(['client/specs/clientApp/*.js'], {read: false})
  				 .pipe(mocha({reporter: 'spec', timeout: 10000}))
  				 .pipe(exit());
});