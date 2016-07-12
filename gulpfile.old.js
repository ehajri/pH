// gulpfile.js

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var babel = require("gulp-babel");

gulp.task('javascript', function () {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: './src/ph.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('src/ph.js'))
        .pipe(buffer())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('.', {
            mapFile: function(mapFilePath) {
                // source map files are named *.map instead of *.js.map
                return mapFile.replace('.map', 'js.map');
            }
        }))
        .pipe(rename(function(path) {
            "use strict";
            path.basename = path.basename.replace('ph', 'ph.compiled');
            path.dirname = '';
            return path;
        }))
        .pipe(gulp.dest('./compiled'));
});

gulp.task("watch-ph", function() {
    gulp.watch("src/ph.js", ["javascript"]);
});