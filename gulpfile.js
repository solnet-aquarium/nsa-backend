var gulp = require('gulp'),
  cover = require('gulp-coverage'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha'),
  watch = require('gulp-watch'),
  jscs = require('gulp-jscs'),
  nodemon = require('gulp-nodemon'),
  browserSync = require('browser-sync'),
  chalk = require('chalk'),
  run = require('gulp-run'),
  del = require('del');


var BROWSER_SYNC_RELOAD_DELAY = 500;

// Common project paths
var paths = {};

paths.base = './lib';
paths.src = [
     './server.js',
     paths.base + '/**/*.js',
     '!/**/node_modules/**/*.js'
     ];

paths.tests = [
  './test/**/*.js'
  ];

// An error handler for the tests during gulp-watch
// Otherwise the gulp-watch will terminate
var handleError = function(err){
  console.log(chalk.red(err.name + ': ' + err.plugin + ' - ' + err.message));
  return;
};

/**
 * Gulp Tasks
 */

// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('develop', function () {
  nodemon({ script: 'server.js', ext: 'js', ignore: ['public/**','frontend/**', 'gulpfile.js'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!');
       setTimeout(function reload() {
        browserSync.reload({
          stream: false   //
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});


gulp.task('browser-sync', ['develop'], function () {

  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync.init({

    // watch the following files; changes will be injected (css & images) or cause browser to refresh
    files: ['public/**/*.*'],

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000,

    // open the proxied app in chrome
    browser: ['google chrome']
  });
});


gulp.task('watch-frontend', function(){
  gulp.watch('frontend/app/**/*.coffee', ['build-frontend']);
  gulp.watch('frontend/**/*.jade', ['build-frontend']);
  gulp.watch('frontend/**/*.styl', ['build-frontend']);
});

// lint source with jshint
gulp.task('lint',['jscs'], function(){
  return gulp.src(paths.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('jscs', function(){
  return gulp.src(paths.src)
        .pipe(jscs());
});

// run the mocha tests with the default dot reporter
gulp.task('test', function(){
  return gulp.src(paths.tests)
    .pipe(mocha({
      reporter: 'dot'
    }))
    .on('error', handleError);

});

// run the mocha tests with the spec reporter
gulp.task('spec', function(){
  return gulp.src(paths.tests)
    .pipe(mocha({
      reporter: 'spec'
    }))
    .on('error', handleError);
});

// generate a coverage report
gulp.task('coverage', function(){
  return gulp.src(paths.tests)
    .pipe(cover.instrument({
      pattern: paths.src,
      debugDirectory: '.coverdebug'
    }))
    .pipe(mocha({
      reporter: 'spec'
    }))
    .pipe(cover.report({
      outFile: 'coverage.html'
    }))
    .on('error', handleError);
});

gulp.task('build-frontend', function(cb) {
  run('cd frontend && gulp').exec();
  cb();
});

// delete the coverage report
gulp.task('clean-coverage', function(done){
  del(['.coverdebug', '.coverdata', '.coverrun', 'coverage.html'], done);
});


/*
 * run docker and run mongodb
 *
 */

 gulp.task('get-mongodb', function(done) {
  return run('docker pull dockerfile/mongodb').exec();
 });

 gulp.task('load-mongodb-image', function(done) {
  return run('docker load < nsadb.tar').exec();
 });

// only run this once
gulp.task('init-mongodb', function(done) {
  return run('docker run -d -i -t -p 27017:27017 -P --name nsadb dockerfile/mongodb').exec();
 });

 gulp.task('run-mongodb', function(done) {
  return run('launchctl load /usr/local/opt/mongodb/homebrew.mxcl.mongodb.plist').exec();
 });

 gulp.task('stop-mongodb', function(done) {
  return run('launchctl unload /usr/local/opt/mongodb/homebrew.mxcl.mongodb.plist').exec();
 });

 gulp.task('prep-mac', function(done) {
  run('brew install mongodb').exec();
 });

 // gulp.task('prep-mac', ['init-mongodb', 'get-mongodb', 'prep-docker-mac']);

 // gulp.task('prep-docker-mac', function(done) {
 //  return run('boot2docker init && boot2docker up && boot2docker stop && ./scripts/open-dockerports.sh && boot2docker start').exec();
 // });

/*
 * auto/watch gulp tasks that will trigger the tests on
 * file changes
 */

gulp.task('autotest', function(){
  gulp.watch(paths.src.concat(paths.tests), ['test']);
});


gulp.task('default', ['lint', 'jscs', 'build-frontend','watch-frontend', 'browser-sync'], function() {
});
