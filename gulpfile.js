const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const csso = require('gulp-csso');
 
gulp.task('js', () => {
  return gulp.src('src/modal.js')
    .pipe(rename('modal.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('css', () => {
  return gulp.src('src/modal.css')
      .pipe(rename('modal.min.css'))
      .pipe(csso())
      .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['js', 'css']);