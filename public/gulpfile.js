var gulp = require('gulp');
var browserify = require('gulp-browserify');

gulp.task('bundleScripts', function() {
	gulp.src('./js/app.js')
		.pipe(browserify())
		.pipe(gulp.dest('./js/bin'))
});

var watcher = gulp.watch('./js/*.js', ['bundleScripts']);