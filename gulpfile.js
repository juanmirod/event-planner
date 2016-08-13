var gulp = require('gulp');
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var browserSync = require('browser-sync').create();
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

gulp.task('default', ['styles'], function() {

  browserSync.init({
    server: './'
  });

  gulp.watch('less/**/*.less', ['styles'])
    .on('change', browserSync.reload);

  gulp.watch('js/**/*.js')
    .on('change', browserSync.reload);

  gulp.watch('index.html')
    .on('change', browserSync.reload);    
});

gulp.task('styles', function() {
  gulp.src('less/**/*.less')
    .pipe(less(['autoprefix']))
    .pipe(gulp.dest('./css'));
});