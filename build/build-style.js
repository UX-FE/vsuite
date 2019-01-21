const gulp = require('gulp')
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const autoprefixer = require('gulp-autoprefixer')

gulp.task('css', function () {
  gulp.src('../src/styles/index.scss')
        .pipe(sass())
        .pipe(autoprefixer({
          browsers: ['last 2 versions', 'ie > 8']
        }))
        .pipe(cleanCSS())
        .pipe(rename('vsuite.css'))
        .pipe(gulp.dest('../dist/styles'))
})

gulp.task('default', ['css'])
