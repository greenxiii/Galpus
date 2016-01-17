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
    pngquant = require('imagemin-pngquant');

var onError = function (err) {
    beep();
    console.log(err);
};

gulp.task('styles-compile', function() {
    gulp.src('less/global.less')
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

gulp.task('styles-minify', function() {
    gulp.src('css/global.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'Styles-minify task complete' }));
});

gulp.task('html', function() {
    gulp.src('*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'Html task for index complete' }));

});

gulp.task('javaScript', function() {
    return gulp.src('js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: 'javaScript task complete' }));
});

gulp.task('images', function() {
    return gulp.src('images/*.png')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Image task complete' }));
});

gulp.task('default', ['styles-compile', 'watch']);

gulp.task('build', ['styles-compile', 'styles-minify', 'html', 'javaScript', 'images']);

gulp.task('watch', function() {
  gulp.watch('less/*.less', ['styles']);
  gulp.watch('*.html', ['html']);
  gulp.watch('js/*.js', ['javaScript']);
});

