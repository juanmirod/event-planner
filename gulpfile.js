var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var cleanCSS = require('gulp-clean-css');
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var browserSync = require('browser-sync').create();
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
var mainBowerFiles = require('main-bower-files');
var jasmine = require('gulp-jasmine-phantom');

//////////////////////////// STYLES ///////////////////////////////////////////////
/*
  Copies bower main files to the public folder
  */
gulp.task('bower', function() {
 gulp.src(mainBowerFiles(), {
      base: 'bower_components'
    })
    .pipe(gulp.dest('public/lib'));
  
});

/*
  Copy our custom variables.less file to the bootstrap folder in public
  */
gulp.task('bootstrap:copyLess', ['bower'], function() {
  gulp.src('less/variables.less')
    .pipe(gulp.dest('public/lib/bootstrap/less'));
});

/*
  Compile Bootstrap using our custom variables
  */
gulp.task('bootstrap:compile', ['bootstrap:copyLess'], function() {
  gulp.src('public/lib/bootstrap/less/bootstrap.less')
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/lib/bootstrap/dist/css'));
});

/*
  Compile any other extra less file in the less folder
  */
gulp.task('customStyles', function(){

  gulp.src('less/**/!(variables).less')
    .pipe(less(['autoprefix']))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public/css'));

});

/*
  Run the less compilation, both bootstrap and application custom files 
  */
gulp.task('styles', ['bootstrap:compile', 'customStyles']);


////////////////////////////////////// JS //////////////////////////////////////////////

/*
  This task builds the two main js files, one for third party libraries (vendor.js)
  and one for the app (app.js). It also copies all html templates to the public folder to 
  be able to serve them.
  */
gulp.task('js:dev', function() {

  gulp.src('js/**/!(*_test).js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js'));

  gulp.src('js/**/*.html')
    .pipe(gulp.dest('./public/js'));

  // copy dev.html to index.html
  gulp.src('dev.html')
    .pipe(concat('index.html'))
    .pipe(gulp.dest('./'));

  gulp.src([
    'bower_components/firebase/firebase.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-animate/angular-animate.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angularfire/dist/angularfire.js',
    'bower_components/ngmap/build/scripts/ng-map.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/js'));

});


// Build for production, using minified files
gulp.task('js:dist', function() {

  gulp.src('js/**/!(*_test).js')
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));

  gulp.src('js/**/*.html')
    .pipe(gulp.dest('./public/js'));


  gulp.src([
    'bower_components/firebase/firebase.js',
    'bower_components/angular/angular.min.js',
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/angular-route/angular-route.min.js',
    'bower_components/angularfire/dist/angularfire.min.js',
    'bower_components/ngmap/build/scripts/ng-map.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js'
    ])
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./public/js'));

});

//////////////////////////// TESTS ////////////////////////////////////////
/*
  Run the tests suite once
  */
gulp.task('tests', ['js:dev'], function () {
  
  gulp.src([
    'public/js/vendor.js',
    'bower_components/angular-mocks/angular-mocks.js', 
    'public/js/app.js', 
    'js/**/*_test.js'
  ])
  .pipe(jasmine({
    integration: true,
    jasmineversion: '2.4'
  }));

});

/*
  Watches for js changes and run the tests suite
  */
gulp.task('testrunner', ['tests'], function() {

  gulp.watch('js/**/*.js', ['tests']);

});

///////////////////////////// LIVE RELOADING ////////////////////////////////////////
/*
  Launch the server
*/
gulp.task('server', function() {

  browserSync.init({
    server: {
      baseDir: './'
    }
  });

});

/*
  Reloads the server
  */
gulp.task('reload', function() {
    browserSync.reload();
});

/* 
  Runs browserSync server and watches for changes 
  in css, js or html to reload the browser.
  */

// Development
gulp.task('serve', ['server', 'styles', 'js:dev'], function() {

  gulp.watch('less/**/*.less', ['styles']);

  gulp.watch('js/**/*.*', ['js:dev']);

  gulp.watch([
    'public/lib/bootstrap/dist/css/*.css',
    'public/js/**/*.js',
    'public/js/**/*.html',
    'public/index.html'
    ], ['reload']);

});

// Minified files for production
gulp.task('serve:dist', ['server', 'build'], function() {

  gulp.watch('less/**/*.less', ['styles']);

  gulp.watch('js/**/*.*', ['build']);

  gulp.watch([
    'public/lib/bootstrap/dist/css/*.css',
    'public/js/**/*.js',
    'public/js/**/*.html',
    'public/index.html'
    ], ['reload']);

});

///////////////////// BUILD ONCE FOR PRODUCTION//////////////////////
gulp.task('build', ['styles', 'js:dist'], function() {

	// copy dev.html to index.html
  gulp.src('dev.html')
    .pipe(concat('index.html'))
    .pipe(gulp.dest('./'));
  
  // modify index to use minified files
  gulp.src('./index.html')
    .pipe(replace('vendor.js', 'vendor.min.js'))
    .pipe(replace('app.js', 'app.min.js'))
    .pipe(gulp.dest('./'));

});
