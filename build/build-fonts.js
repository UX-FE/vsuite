const gulp = require('gulp')
const fontsPath = process.env.Node_ENV === 'dev' ? '../examples/fonts' : '../dist/styles/fonts'

gulp.task('fonts', function () {
  gulp.src('../src/styles/common/iconfont/fonts/*.*')
        .pipe(gulp.dest(fontsPath))
})

gulp.task('default', ['fonts'])
