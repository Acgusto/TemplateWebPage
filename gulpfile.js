const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const uglify = require('gulp-uglify');

const tsconfig = typescript.createProject('tsconfig.json');

gulp.task('minify-html', () => {
 return gulp.src('www/src/**/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('www/dist/pages'));
});

gulp.task('minify-css', () => {
 return gulp.src('www/src/styles/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(cleanCSS())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('www/dist/styles'));
});

gulp.task('uglify-js', () => {
 return tsconfig.src()
  .pipe(sourcemaps.init())
  .pipe(tsconfig())
  .pipe(babel({
    presets: ['@babel/preset-env']
  }))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('www/dist/scripts'));
});

gulp.task('build', gulp.parallel('minify-html', 'minify-css', 'uglify-js'));

gulp.task('watch', () => {
  gulp.watch('www/src/**/*.html', gulp.series('minify-html'));
  gulp.watch('www/src/styles/**/*.scss', gulp.series('minify-css'));
  gulp.watch('www/src/scripts/**/*.ts', gulp.series('uglify-js'));
});

gulp.task('default', gulp.series('build', 'watch'));
