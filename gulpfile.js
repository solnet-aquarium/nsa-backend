var gulp = require('gulp'),
    del = require('del'),
    nconf = require('nconf'),
    p = require('gulp-load-plugins')();

nconf.argv().env().file({ file: './gulpd/config.json'});

// Common project paths
var paths = nconf.get('paths');

// An error handler for the tests during gulp-watch
// Otherwise the gulp-watch will terminate
var handleError = function(err){
  console.log(p.chalk.red(err.name + ': ' + err.plugin + ' - ' + err.message));
  return;
};

/**
 * Gulp Tasks
 */
// lint source with jshint
gulp.task('lint',['jscs'], function(){
  return gulp.src(paths.src)
    .pipe(p.jshint())
    .pipe(p.jshint.reporter('default'));
});

gulp.task('jscs', function(){
  return gulp.src(paths.src)
    .pipe(p.jscs());
});

// run the mocha tests with the default dot reporter
gulp.task('test', function(){
  return gulp.src(paths.tests)
    .pipe(p.mocha({
      reporter: 'dot'
    }))
    .on('error', handleError)
    .once('end', function() { 
      process.exit();
    });
});

// run the mocha tests with the spec reporter
gulp.task('spec', function(){
  return gulp.src(paths.tests)
    .pipe(p.mocha({
      reporter: 'spec'
    }))
    .on('error', handleError)
    .once('end', function() {
      process.exit();
    });
});

// generate a coverage report
gulp.task('coverage', function(){
  return gulp.src(paths.tests)
    .pipe(p.coverage.instrument({
      pattern: paths.src,
      debugDirectory: '.coverdebug'
    }))
    .pipe(p.mocha({
      reporter: 'spec'
    }))
    .pipe(p.coverage.gather())
    .pipe(p.coverage.format())
    .pipe(gulp.dest('reports'))
    .on('error', handleError)
    .on('end', function() {
      process.exit();
    });
});

// delete the coverage report
gulp.task('clean-coverage', function(done){
  del(['.coverdebug', '.coverdata', '.coverrun', 'reports'], done);
});


/*
 * run docker and run mongodb
 *
 */

 gulp.task('get-mongodb', function(done) {
  return p.run('docker pull dockerfile/mongodb').exec();
 });

 gulp.task('load-mongodb-image', function(done) {
  return p.run('docker load < nsadb.tar').exec();
 });

// only run this once
gulp.task('init-mongodb', function(done) {
  return p.run('docker run -d -i -t -p 27017:27017 -P --name nsadb dockerfile/mongodb').exec();
 });

 gulp.task('run-mongodb', function(done) {
  return p.run('launchctl load /usr/local/opt/mongodb/homebrew.mxcl.mongodb.plist').exec();
 });

 gulp.task('stop-mongodb', function(done) {
  return p.run('launchctl unload /usr/local/opt/mongodb/homebrew.mxcl.mongodb.plist').exec();
 });

 gulp.task('prep-mac', function(done) {
  p.run('brew install mongodb').exec();
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

gulp.task('default', ['lint']);
