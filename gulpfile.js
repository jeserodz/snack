var gulp = require('gulp');
var browserify = require('gulp-browserify');
var server = require('gulp-express');

gulp.task('browserify', function() {
	gulp.src('./public/js/app.js')
		.pipe(browserify())
		.pipe(gulp.dest('./public/js/bin'))
		.pipe(server.notify());
});

gulp.task('start', ['browserify'], function() {
	server.run(['./index.js']);
});

gulp.task('watch', ['start'], function() {

	gulp.watch('./*.js', ['start']);
	gulp.watch('./api/*.js', ['start']);
	gulp.watch('./models/*.js', ['start']);
	gulp.watch('./public/js/controllers/*.js', ['browserify']);
	gulp.watch('./public/js/directives/*.js', ['browserify']);
	gulp.watch('./public/js/routes/*.js', ['browserify']);
	gulp.watch('./public/js/services/*.js', ['browserify']);
	gulp.watch('./public/js/utils/*.js', ['browserify']);
	gulp.watch('./public/js/*.js', ['browserify']);
	gulp.watch('./public/**/*.html', ['browserify']);
});
