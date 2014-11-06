var gulp = require('gulp'),
  cover = require('gulp-coverage'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha'),
  server = require('gulp-develop-server'),
  livereload = require('gulp-livereload'),
  watch = require('gulp-watch'),
  jscs = require('gulp-jscs'),
  chalk = require('chalk'),
  del = require('del');

// Common project paths
var paths = {
  'src':['./server.js', './lib/**/*.js','./routes/**/*.js'],
  'tests':['./test/**/*.js']
};

// An error handler for the tests during gulp-watch
// Otherwise the gulp-watch will terminate
var handleError = function(err){
  console.log(chalk.red(err.name + ': ' + err.plugin + ' - ' + err.message));
  return;
};

/**
 * Gulp Tasks
 */

gulp.task( 'server:start', function() {
    server.listen( { path: './server.js' }, livereload.listen );
});

// If server scripts change, restart the server and then livereload.
gulp.task( 'server:restart', [ 'server:start' ], function() {

    function restart( file ) {
        server.changed( function( error ) {
            if( ! error ) livereload.changed( file.path );
        });
    }

    gulp.watch( paths.src ).on( 'change', restart );
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

// delete the coverage report
gulp.task('clean-coverage', function(done){
  del(['.coverdebug', '.coverdata', '.coverrun', 'coverage.html'], done);
});


/*
 * auto/watch gulp tasks that will trigger the tests on
 * file changes
 */

gulp.task('autotest', function(){
  gulp.watch(paths.src.concat(paths.tests), ['test']);
});


gulp.task('default', ['lint', 'jscs', 'server:restart'], function() {
});
