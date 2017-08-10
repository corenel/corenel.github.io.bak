var gulp = require('gulp')
var cleanCSS = require('gulp-clean-css')
var uglify = require('gulp-uglify')
var htmlmin = require('gulp-htmlmin')
var imagemin = require('gulp-imagemin')
var pump = require('pump')
var babel = require('gulp-babel')

gulp.task('minify-css', function () {
  return gulp.src(['public/**/*.css', '!public/**/*.min.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('public'))
})

// gulp.task('minify-images', function () {
//   return gulp.src(['public/**/*.{gif,jpg,png,svg}'])
//   .pipe(imagemin({
//     optimizationLevel: 5,
//     progressive: true,
//     interlaced: true,
//     multipass: true
//   }))
//   .pipe(gulp.dest('public'))
// })

gulp.task('minify-images', () =>
    gulp.src('public/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'))
)

gulp.task('minify-html', function () {
  return gulp.src('public/**/*.html')
             .pipe(htmlmin({collapseWhitespace: true}))
             .pipe(gulp.dest('public'))
})

// gulp.task('minify-js', function () {
  // return gulp.src(['public/**/*.js', '!public/**/*.min.js'])
             // .pipe(uglify())
             // .pipe(gulp.dest('public'))
// })
gulp.task('minify-js', function (cb) {
  pump([
        gulp.src(['public/**/*.js', '!public/**/*.min.js']),
		babel({presets: ['es2015']}),
        uglify(),
        gulp.dest('public')
    ],
    cb
  );
})


gulp.task('default', [
  'minify-css', 'minify-images', 'minify-html', 'minify-js'
], function () {
  console.log('gulp task done!')
})
