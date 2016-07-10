// gulpfile.js

var gulp = require("gulp");
var babel = require("gulp-babel");
var rename = require("gulp-rename");

gulp.task("default", function () {
    return gulp.src("src/ph.js")
        .pipe(babel())
        .pipe(rename(function(path) {
            "use strict";
            path.basename += '.compiled';
            //console.log(path);
        }))
        .pipe(gulp.dest("compiled"));
});