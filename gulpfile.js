var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var browserify = require('gulp-browserify');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var minify = require('gulp-minify');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');

  // place code for your default task here
  // 
  // 
  // compile the less
  // compile the javascript
  // modify index.jade for production
  // change environment variable so the app can access correct database, etc

gulp.task('server-js', function() {
	return gulp.src(['./src/server/**/*.js', '!./src/server/static/js/*'])
		// .pipe(browserify())
		// .pipe(minify())
		.pipe(gulp.dest('./dist/server'));
});

gulp.task('common-js', function() {
	return gulp.src(['./src/common/**/*.js'])
		.pipe(gulp.dest('./dist/common'));
})

gulp.task('server-mv-views', function() {
	return gulp.src('./src/server/views/*')
		.pipe(gulp.dest('./dist/server/views'));
});

gulp.task('server-mv-static', function() {
	return gulp.src('./src/server/static/img/*')
		.pipe(gulp.dest('./dist/server/static/img'));
});

gulp.task('less', function () {
  return gulp.src('./src/client/less/styles.less')
    .pipe(less({
    	paths: [ './node_modules/bootstrap/less/' ]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dist/server/static/css'));
});

gulp.task('client-mv-view', function() {
	return gulp.src('./src/client/view/*')
		.pipe(gulp.dest('./dist/server/static/view'));
});

gulp.task('client-mv-css', function() {
	return gulp.src('./src/client/less/*.png')
		.pipe(gulp.dest('./dist/server/static/css'));
});

gulp.task('client-js', function() {
	return gulp.src('./src/client/js/app.js')
		.pipe(browserify())
		.pipe(minify({
			noSource: true
		}))
		.pipe(gulp.dest('./dist/server/static/js'));
});

gulp.task('clean', function() {
	return gulp.src('./dist', { read: false })
		.pipe(clean());
});

gulp.task('default', function(cb) {
	runSequence('clean', ['server-js', 'common-js', 'server-mv-views', 'server-mv-static', 'less', 'client-mv-view', 'client-mv-css', 'client-js'], cb);
});