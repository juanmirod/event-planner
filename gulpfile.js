var gulp = require('gulp');
var concat = require('gulp-concat');
//var uglify = require('uglify');
//var order = require('order');
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var browserSync = require('browser-sync').create();
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
var mainBowerFiles = require('main-bower-files');

browserSync.init({
  server: './public/'
});

gulp.task('reload', function(){
    browserSync.reload();
});


gulp.task('bower', function() {
 gulp.src(mainBowerFiles(), {
      base: 'bower_components'
    })
    .pipe(gulp.dest('public/lib'));
  
});

gulp.task('bootstrap:copyLess', ['bower'], function() {
  gulp.src('less/variables.less')
    .pipe(gulp.dest('public/lib/bootstrap/less'));
});

gulp.task('bootstrap:compile', ['bootstrap:copyLess'], function() {
  gulp.src('public/lib/bootstrap/less/bootstrap.less')
    .pipe(less())
    .pipe(gulp.dest('public/lib/bootstrap/dist/css'));
});

gulp.task('customStyles', function(){

  gulp.src('less/**/*.less')
    .pipe(less(['autoprefix']))
    .pipe(gulp.dest('./public/css'));

})

gulp.task('styles', ['bootstrap:compile', 'customStyles']);

gulp.task('buildjs', function() {

  gulp.src('js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js'));

  gulp.src([
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/js'));

});

gulp.task('default', ['styles', 'buildjs'], function() {

  gulp.watch('less/**/*.less', ['styles']);

  gulp.watch([
    'public/lib/bootstrap/dist/css/*.css',
    'js/**/*.js',
    'public/index.html'
    ], ['reload']);

});