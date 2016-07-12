var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var rename = require('gulp-rename');

function compile(watch) {
    var bundler = watchify(browserify('./src/ph.js', { debug: true }).transform(babel, {presets: ['es2015']}));

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source('ph.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(rename(function(path) {
                "use strict";
                path.basename = path.basename.replace('ph', 'ph.compiled');
                path.dirname = '';
                return path;
            }))
            .pipe(gulp.dest('./compiled'));
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...', new Date().toTimeString());
            rebundle();
        });
    }

    rebundle();
}

function watch() {
    return compile(true);
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch']);