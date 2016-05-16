var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');

gulp.task('minify-css', function() {
    return gulp.src(["public/**/*.css","!public/**/*.min.css"])
        .pipe(minifycss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./public'));
});

gulp.task('minify-images', function() {
    return gulp.src(["public/**/*.{gif,jpg,png,svg}"])
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest('./public/'));
});

gulp.task('minify-html', function() {
  return gulp.src("public/**/*.html")
    .pipe(htmlclean())
    .pipe(htmlmin({
         removeComments: true,
         minifyJS: true,
         minifyCSS: true,
         minifyURLs: true,
    }))
    .pipe(gulp.dest('./public'))
});

gulp.task('minify-js', function() {
    return gulp.src(["public/**/*.js","!public/**/*.min.js"])
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});

gulp.task('default', [
    'minify-images', 'minify-html','minify-css','minify-js'
],function(){
    console.log("gulp task ok!");
});
