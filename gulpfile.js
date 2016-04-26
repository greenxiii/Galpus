var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    path = require('path'),
    beep = require('beepbeep'),
    cssmin = require('gulp-cssmin'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    coffee = require('gulp-coffee'),
    exec = require('child_process').exec,
    bs = require('browser-sync').create(),
    KarmaServer = require('karma').Server;

var onError = function (err) {
    beep();
    console.log(err);
};

gulp.task('browser-sync', ['coffee-compile', 'styles-compile'], function() {
    bs.init({
        server: {
            baseDir: "./"
        },
        // proxy: "yourwebsite.com" 
    });
});

gulp.task('tests', function(done){
    return new KarmaServer({
        configFile: __dirname + '/karma.local.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('styles-compile', function() {
    return gulp.src('less/global.less')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('css'))
        .pipe(notify({ message: 'Styles-compile task complete' }));
});

gulp.task('styles-minify', ['styles-compile'], function() {
    gulp.src('css/global.css')
        .pipe(cssmin())
        .pipe(gulp.dest('css/min'))
        .pipe(notify({ message: 'Styles-minify task complete' }));
});

gulp.task('html', function() {
    gulp.src('*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'Html task for index complete' }));

});

gulp.task('coffee-compile', function() {
    return gulp.src('coffee/**/*.coffee')
            .pipe(coffee({bare: true}))
            .pipe(plumber({
                errorHandler: onError
            }))
            .pipe(gulp.dest('js'))
            .pipe(notify({ message: 'coffee-compile task complete' }));
});

gulp.task('javaScript-uglify', ['coffee-compile'], function() {
    return gulp.src('js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('js/min'))
        .pipe(notify({ message: 'javaScript-uglify task complete' }));
});

gulp.task('images', function() {
    return gulp.src('images/*.png')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('images/compiled'))
        .pipe(notify({ message: 'Image task complete' }));
});

gulp.task('default', ['styles-compile', 'coffee-compile', 'tests', 'watch']);

gulp.task('build', ['styles-minify', 'html', 'javaScript-uglify', 'images']);

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('less/*.less', ['styles-compile', bs.reload]);
  gulp.watch('coffee/*.coffee', ['coffee-compile']);
  gulp.watch('js/*.js', [ 'tests', bs.reload]);
  gulp.watch('*.html').on('change', bs.reload);
});

